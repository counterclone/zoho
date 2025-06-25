import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

const {
  ZOHO_CLIENT_ID,
  ZOHO_CLIENT_SECRET,
  ZOHO_REDIRECT_URI,
  ZOHO_SCOPE,
  PORT = 5000,
  ZOHO_APP_LINK_NAME,
  ZOHO_CASH_REPORT,
  ZOHO_RECEIVABLES_REPORT,
  ZOHO_PAYABLES_REPORT,
} = process.env;

let refreshToken: string | null = null;
let currentAccessToken: string | null = null; // Use a distinct variable for the in-memory access token

// Function to refresh the access token
const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshToken) return null;

  try {
    const tokenRes = await axios.post(
      "https://accounts.zoho.in/oauth/v2/token", // Use .in for token refresh too
      null,
      {
        params: {
          grant_type: "refresh_token",
          client_id: ZOHO_CLIENT_ID,
          client_secret: ZOHO_CLIENT_SECRET,
          refresh_token: refreshToken,
        },
      }
    );
    currentAccessToken = tokenRes.data.access_token;
    console.log("Access token refreshed successfully.");
    return currentAccessToken;
  } catch (err: any) {
    console.error("Error refreshing access token:", err.response?.data || err.message);
    refreshToken = null; // Invalidate refresh token on failure
    currentAccessToken = null;
    return null;
  }
};

// 1. Start OAuth flow
app.get("/api/auth/login", (req: Request, res: Response) => {
  const url = `https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=${ZOHO_CLIENT_ID}&scope=${ZOHO_SCOPE}&redirect_uri=${encodeURIComponent(
    ZOHO_REDIRECT_URI!
  )}&access_type=offline&prompt=consent`;
  res.redirect(url);
});

// 2. Handle OAuth callback
app.get("/api/auth/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).send("Missing code");

  try {
    const tokenRes = await axios.post(
      "https://accounts.zoho.in/oauth/v2/token", // Use .in for initial token exchange too
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: ZOHO_CLIENT_ID,
          client_secret: ZOHO_CLIENT_SECRET,
          redirect_uri: ZOHO_REDIRECT_URI,
          code,
        },
      }
    );
    currentAccessToken = tokenRes.data.access_token;
    refreshToken = tokenRes.data.refresh_token; // Store refresh token

    res.cookie("zoho_access_token", currentAccessToken, { httpOnly: true, sameSite: "lax" });
    // You might also want to set a cookie for refreshToken if you persist it on client side
    // For this example, we keep refresh token in server memory

    res.redirect("http://localhost:3000"); // Redirect to frontend
  } catch (err: any) {
    console.error("OAuth callback error:", err.response?.data || err.message);
    res.status(500).send("OAuth error");
  }
});

// 3. Fetch metrics from Zoho Creator
app.get("/api/metrics", async (req: Request, res: Response) => {
  let accessToken = req.cookies.zoho_access_token || currentAccessToken;

  if (!accessToken && refreshToken) {
    accessToken = await refreshAccessToken();
    if (accessToken) {
      res.cookie("zoho_access_token", accessToken, { httpOnly: true, sameSite: "lax" });
    }
  }

  if (!accessToken) return res.status(401).json({ error: "Not authenticated" });

  try {
    const appLinkName = ZOHO_APP_LINK_NAME!;
    const cashReport = ZOHO_CASH_REPORT!;
    const receivablesReport = ZOHO_RECEIVABLES_REPORT!;
    const payablesReport = ZOHO_PAYABLES_REPORT!;

    // Helper to fetch and sum a report
    const fetchSum = async (reportName: string, field: string): Promise<number> => {
      const url = `https://creator.zoho.in/api/v2/${appLinkName}/report/${reportName}`;
      try {
        const resp = await axios.get(url, {
          headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
        });
        return resp.data.data.reduce(
          (sum: number, row: any) => sum + (Number(row[field]) || 0),
          0
        );
      } catch (err: any) {
        // If token expired, try to refresh and retry (only once to avoid loops)
        if (err.response?.data?.code === 1030 && refreshToken) {
          console.log("Access token expired. Attempting to refresh...");
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            console.log("Retrying API call with new access token...");
            res.cookie("zoho_access_token", newAccessToken, { httpOnly: true, sameSite: "lax" });
            // Retry the request with the new access token
            const retryResp = await axios.get(url, {
              headers: { Authorization: `Zoho-oauthtoken ${newAccessToken}` },
            });
            return retryResp.data.data.reduce(
              (sum: number, row: any) => sum + (Number(row[field]) || 0),
              0
            );
          } else {
            throw new Error("Failed to refresh access token.");
          }
        } else {
          throw err; // Re-throw other errors
        }
      }
    };

    // You must update the field names below to match your Zoho Creator schema
    const cash = await fetchSum(cashReport, "Amount"); // Update "Amount" with the actual field name for Cash
    const receivables = await fetchSum(receivablesReport, "Outstanding"); // Update "Outstanding" with the actual field name for Accounts Receivable
    const payables = await fetchSum(payablesReport, "Outstanding");     // Update "Outstanding" with the actual field name for Accounts Payable

    res.json({ cash, receivables, payables });
  } catch (err: any) {
    console.error("Error fetching metrics from Zoho Creator:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

app.listen(Number(PORT), () => {
  console.log(`Backend running on http://localhost:${PORT}`);
}); 
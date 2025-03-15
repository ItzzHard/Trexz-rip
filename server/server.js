import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config({ path: "../.env" });

const app = express();
const port = process.env.PORT || 3001;

// Add CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://trexzf.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Allow express to parse JSON bodies
app.use(express.json());

app.post("/api/token", async (req, res) => {
  try {
    // Exchange the code for an access_token
    const response = await fetch(`https://discord.com/api/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.VITE_DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: req.body.code,
      }),
    });

    const data = await response.json();
    
    // Log for debugging (remove in production)
    console.log("Discord token exchange response:", data);
    
    if (data.error) {
      return res.status(400).json(data);
    }

    // Return the access_token to our client
    res.json({ access_token: data.access_token });
  } catch (error) {
    console.error("Error exchanging token:", error);
    res.status(500).json({ error: "Failed to exchange token" });
  }
});

// Add a health check endpoint
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

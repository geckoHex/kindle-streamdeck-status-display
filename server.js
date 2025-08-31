// server.js
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());

// Serve static files (icons, CSS, etc.)
app.use(express.static(path.join(__dirname, "public")));

let currentStatus = "open"; // default

// 🔑 Define your API key (in production, load from env var)
const API_KEY = "supersecret123";

// Middleware to check API key
function checkAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  // Expect header like: Authorization: Bearer supersecret123
  const token = authHeader.split(" ")[1];
  if (token !== API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
}

// Endpoint to update status (protected)
app.post("/status", checkAuth, (req, res) => {
  const { status } = req.body;
  if (status) {
    currentStatus = status.toLowerCase();
    console.log("Status updated:", currentStatus);
    res.json({ success: true, status: currentStatus });
  } else {
    res.status(400).json({ success: false, error: "Missing status" });
  }
});

// Endpoint to get current status (public, Kindle uses this)
app.get("/status", (req, res) => {
  res.json({ status: currentStatus });
});

// Kindle-friendly webpage (public)
app.get("/", (req, res) => {
  let icon = "open.svg";
  let label = "OPEN";

  if (currentStatus === "closed") {
    icon = "closed.svg";
    label = "CLOSED";
  } else if (currentStatus === "busy") {
    icon = "closed.svg"; // or busy.svg if you add one
    label = "BUSY";
  }

  res.send(`
    <html>
      <head>
        <meta http-equiv="refresh" content="3">
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #fff;
            color: #000;
            font-family: sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
          }
          .icon {
            width: 200px;
            height: 200px;
            margin-bottom: 20px;
          }
          .status {
            font-size: 5em;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <img src="${icon}" class="icon" alt="${label} icon" />
        <div class="status">${label}</div>
      </body>
    </html>
  `);
});

app.listen(3000, () =>
  console.log("✅ Server running on http://localhost:3000")
);
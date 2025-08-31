// src/server.js
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";
import http from "http";
import https from "https";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());

// Load statuses from JSON
const statuses = JSON.parse(
  fs.readFileSync(path.join(__dirname, "statuses.json"), "utf-8")
);

const API_KEY = process.env.API_KEY || "changeme";
const PORT = process.env.PORT || 3000;
const USE_HTTPS = process.env.USE_HTTPS === "true"; // toggle in .env

let currentStatus = "open";

// --- Middleware: API Key Authentication ---
function checkAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }
  const token = authHeader.split(" ")[1];
  if (token !== API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }
  next();
}

// --- Routes ---

// Update status (protected)
app.post("/status", checkAuth, (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, error: "Missing status" });
  }

  // Validate against statuses.json
  const valid = statuses.find((s) => s.status === status.toLowerCase());
  if (!valid) {
    return res.status(400).json({ success: false, error: "Invalid status" });
  }

  currentStatus = status.toLowerCase();
  console.log("🔄 Status updated:", currentStatus);
  res.json({ success: true, status: currentStatus });
});

// Get current status (public, Kindle fetches this)
app.get("/status", (req, res) => {
  const statusObj =
    statuses.find((s) => s.status === currentStatus) ||
    statuses.find((s) => s.status === "open");
  res.json(statusObj);
});

// Serve static SVGs from public/
app.use("/icons", express.static(path.join(__dirname, "../public")));

// Serve frontend files from src/
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "style.css"));
});
app.get("/client.js", (req, res) => {
  res.sendFile(path.join(__dirname, "client.js"));
});

// --- Start Server ---
if (USE_HTTPS) {
  try {
    const options = {
      key: fs.readFileSync(
        "/etc/letsencrypt/live/geckohex.app/privkey.pem"
      ),
      cert: fs.readFileSync(
        "/etc/letsencrypt/live/geckohex.app/fullchain.pem"
      ),
    };

    https.createServer(options, app).listen(443, "0.0.0.0", () => {
      console.log("✅ Status Display running at https://geckohex.app");
    });
  } catch (err) {
    console.error("❌ Failed to load SSL certs, falling back to HTTP:", err);
    http.createServer(app).listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Status Display running at http://0.0.0.0:${PORT}`);
    });
  }
} else {
  http.createServer(app).listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Status Display running at http://0.0.0.0:${PORT}`);
  });
}

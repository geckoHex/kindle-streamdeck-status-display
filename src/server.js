// src/server.js (ESM version)
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());

const API_KEY = process.env.API_KEY || "changeme";
const PORT = process.env.PORT || 3000;

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
app.post("/status", checkAuth, (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, error: "Missing status" });
  }
  currentStatus = status.toLowerCase();
  console.log("🔄 Status updated:", currentStatus);
  res.json({ success: true, status: currentStatus });
});

app.get("/status", (req, res) => {
  res.json({ status: currentStatus });
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
app.listen(PORT, () => {
  console.log(`✅ Status Display running at http://localhost:${PORT}`);
});
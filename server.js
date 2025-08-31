// server.js
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());

// Serve static files (HTML, CSS, icons, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Current status (default)
let currentStatus = "open";

// Config from environment
const API_KEY = process.env.API_KEY || "changeme";
const PORT = process.env.PORT || 3000;

// --- Middleware: API Key Authentication ---
function checkAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  // Expect header like: Authorization: Bearer <API_KEY>
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

  currentStatus = status.toLowerCase();
  console.log("🔄 Status updated:", currentStatus);
  res.json({ success: true, status: currentStatus });
});

// Get current status (public, Kindle fetches this)
app.get("/status", (req, res) => {
  res.json({ status: currentStatus });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✅ Status Display running at http://localhost:${PORT}`);
});
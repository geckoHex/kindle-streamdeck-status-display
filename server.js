// server.js (Kindle-optimized display)
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

// Endpoint to update status
app.post("/status", (req, res) => {
  const { status } = req.body;
  if (status) {
    currentStatus = status.toLowerCase();
    console.log("Status updated:", currentStatus);
    res.json({ success: true, status: currentStatus });
  } else {
    res.status(400).json({ success: false, error: "Missing status" });
  }
});

// Endpoint to get current status (for API use)
app.get("/status", (req, res) => {
  res.json({ status: currentStatus });
});

// Kindle-friendly webpage
app.get("/", (req, res) => {
  // Pick icon + label based on status
  let icon = "open.svg";
  let label = "OPEN";

  if (currentStatus === "closed") {
    icon = "closed.svg";
    label = "CLOSED";
  } else if (currentStatus === "busy") {
    icon = "closed.svg"; // or add busy.svg later
    label = "BUSY";
  }

  res.send(`
    <html>
      <head>
        <meta http-equiv="refresh" content="30"> <!-- refresh every 30s -->
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

app.listen(3000, () => console.log("Server running on port 3000"));
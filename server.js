// server.js
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

let currentStatus = "available"; // default

// Endpoint to update status
app.post("/status", (req, res) => {
  const { status } = req.body;
  if (status) {
    currentStatus = status;
    console.log("Status updated:", status);
    res.json({ success: true, status: currentStatus });
  } else {
    res.status(400).json({ success: false, error: "Missing status" });
  }
});

// Endpoint to get current status
app.get("/status", (req, res) => {
  res.json({ status: currentStatus });
});

// Simple webpage for Kindle
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <meta http-equiv="refresh" content="10"> <!-- auto-refresh every 10s -->
        <style>
          body { font-family: sans-serif; text-align: center; margin-top: 40%; }
          .status { font-size: 4em; }
        </style>
      </head>
      <body>
        <div class="status">${currentStatus}</div>
      </body>
    </html>
  `);
});

app.listen(3000, () => console.log("Server running on port 3000"));
// client.js - minimal Kindle-friendly JS

async function updateStatus() {
  try {
    const res = await fetch("/status");
    const data = await res.json();

    const iconEl = document.getElementById("status-icon");
    const textEl = document.getElementById("status-text");

    iconEl.src = data.icon;
    textEl.textContent = data.label;
  } catch (err) {
    console.error("Failed to fetch status", err);
  }
}

// Initial update + refresh every 500ms
updateStatus();
setInterval(updateStatus, 500);

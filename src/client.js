// client.js - minimal Kindle-friendly JS

async function updateStatus() {
  try {
    const res = await fetch("/status");
    const data = await res.json();
    const status = data.status || "open";

    const iconEl = document.getElementById("status-icon");
    const textEl = document.getElementById("status-text");

    if (status === "closed") {
      iconEl.src = "/icons/closed.svg";
      textEl.textContent = "CLOSED";
    } else if (status === "busy") {
      iconEl.src = "/icons/busy.svg";
      textEl.textContent = "BUSY";
    } else {
      iconEl.src = "/icons/open.svg";
      textEl.textContent = "OPEN";
    }
  } catch (err) {
    console.error("Failed to fetch status", err);
  }
}

// Initial update + refresh every 3s
updateStatus();
setInterval(updateStatus, 3000);
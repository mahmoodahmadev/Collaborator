// Function to add a log entry
function addLogEntry(log, isExfiltrated = false) {
  const logsContainer = document.getElementById("logs");
  const logEntry = document.createElement("p");
  logEntry.textContent = isExfiltrated
    ? `[EXFILTRATED] ${log} | Timestamp: ${new Date().toLocaleString()}`
    : log;

  if (isExfiltrated) logEntry.style.color = "red";

  logsContainer.insertBefore(logEntry, logsContainer.firstChild);

  // Keep only last 10 logs
  if (logsContainer.children.length > 10) {
    logsContainer.removeChild(logsContainer.lastChild);
  }

  saveLogsToLocalStorage();
}

// Save logs to localStorage
function saveLogsToLocalStorage() {
  const logsContainer = document.getElementById("logs");
  localStorage.setItem("logs", logsContainer.innerHTML);
}

// Restore logs from localStorage on load
function retrieveLogsFromLocalStorage() {
  const logsContainer = document.getElementById("logs");
  logsContainer.innerHTML = localStorage.getItem("logs") || "";
}

// Get public IP
async function getVisitorIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return "Unknown";
  }
}

// Generate a random status code
function getRandomStatusCode() {
  const codes = [200, 301, 404, 500];
  return codes[Math.floor(Math.random() * codes.length)];
}

// Log normal visit with full URL
function logVisit() {
  getVisitorIP().then(ip => {
    const fullURL = window.location.href;
    const log = `Status Code: ${getRandomStatusCode()} | Timestamp: ${new Date().toLocaleString()} | Sender IP: ${ip} | URL: ${fullURL}`;
    addLogEntry(log);
  });
}

// Log exfiltrated data
function logExfiltratedData(data) {
  addLogEntry(data, true);
}

// Clear logs
function clearLogs() {
  document.getElementById("logs").innerHTML = "";
  saveLogsToLocalStorage();
}

// Download logs
function downloadLogs() {
  const text = Array.from(document.querySelectorAll("#logs p"))
    .map(p => p.textContent)
    .join("\n");
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "logs.txt";
  a.click();
}

// Init
window.addEventListener("load", () => {
  retrieveLogsFromLocalStorage();
  logVisit();

  // Optional: Log example exfiltrated data (simulate)
  const searchParams = window.location.search;
  const path = window.location.pathname;
  if (path !== "/" || searchParams) {
    logExfiltratedData(`Path: ${path} | Query: ${searchParams}`);
  }
});

// Event listeners
document.getElementById("clearLogs").addEventListener("click", clearLogs);
document.getElementById("downloadLogs").addEventListener("click", downloadLogs);

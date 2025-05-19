// Function to add a log entry (normal or exfiltrated)
function addLogEntry(log, isExfiltrated = false) {
  const logsContainer = document.getElementById("logs");
  const logEntry = document.createElement("p");
  logEntry.textContent = isExfiltrated
    ? `[EXFILTRATED] ${log} | Timestamp: ${new Date().toLocaleString()}`
    : log;

  // Optional style to differentiate exfiltrated logs
  if (isExfiltrated) logEntry.style.color = "red";

  logsContainer.insertBefore(logEntry, logsContainer.firstChild);

  // Limit to last 10 logs
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

// Retrieve logs from localStorage on page load
function retrieveLogsFromLocalStorage() {
  const logsContainer = document.getElementById("logs");
  const savedLogs = localStorage.getItem("logs");
  if (savedLogs) logsContainer.innerHTML = savedLogs;
}

// Get visitor IP
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

// Return a hardcoded referrer IP (for demo)
function getReferrerIP() {
  return "192.168.0.1";
}

// Log a normal visit
function logVisit() {
  getVisitorIP().then(ip => {
    const log = `Status Code: ${getRandomStatusCode()} | Timestamp: ${new Date().toLocaleString()} | Sender IP: ${ip} | Referrer IP: ${getReferrerIP()}`;
    addLogEntry(log);
  });
}

// Log exfiltrated data
function logExfiltratedData(data) {
  addLogEntry(data, true);
}

// Clear all logs
function clearLogs() {
  document.getElementById("logs").innerHTML = "";
  saveLogsToLocalStorage();
}

// Download logs to text file
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

// Setup event listeners
window.addEventListener("load", () => {
  retrieveLogsFromLocalStorage();
  logVisit();

  // Simulate example exfiltration log (you can replace this)
  setTimeout(() => {
    logExfiltratedData("username=admin&password=123456");
  }, 2000);
});

document.getElementById("clearLogs").addEventListener("click", clearLogs);
document.getElementById("downloadLogs").addEventListener("click", downloadLogs);

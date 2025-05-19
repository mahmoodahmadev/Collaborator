// Add a log entry (normal or exfiltrated)
function addLogEntry(log, isExfiltrated = false) {
  const logsContainer = document.getElementById("logs");
  const logEntry = document.createElement("p");
  if (isExfiltrated) {
    logEntry.textContent = `[EXFILTRATED] ${log} | Timestamp: ${new Date().toLocaleString()}`;
    logEntry.classList.add("exfiltrated");
  } else {
    logEntry.textContent = log;
  }
  logsContainer.insertBefore(logEntry, logsContainer.firstChild);

  // Limit to max 10 logs
  if (logsContainer.children.length > 10) {
    logsContainer.lastChild.remove();
  }

  saveLogsToLocalStorage();
}

// Clear logs
function clearLogs() {
  const logsContainer = document.getElementById("logs");
  logsContainer.innerHTML = "";
  saveLogsToLocalStorage();
  broadcastClearLogs();
}

// Download logs as text file
function downloadLogs() {
  const logsContainer = document.getElementById("logs");
  let logsText = "";
  // Combine all logs text (with indication for exfiltrated)
  logsContainer.querySelectorAll("p").forEach(p => {
    logsText += p.textContent + "\n";
  });
  const blob = new Blob([logsText], { type: "text/plain" });

  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "logs.txt";
  downloadLink.click();
}

// Save logs to localStorage
function saveLogsToLocalStorage() {
  const logsContainer = document.getElementById("logs");
  localStorage.setItem("logs", logsContainer.innerHTML);
}

// Retrieve logs from localStorage
function retrieveLogsFromLocalStorage() {
  const logsContainer = document.getElementById("logs");
  const savedLogs = localStorage.getItem("logs");
  if (savedLogs) {
    logsContainer.innerHTML = savedLogs;
  }
}

// Get visitor IP
async function getVisitorIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (e) {
    console.error("Failed to get visitor IP:", e);
    return "Unknown";
  }
}

// Random status code generator
function getRandomStatusCode() {
  const statusCodes = [200, 301, 404, 500];
  return statusCodes[Math.floor(Math.random() * statusCodes.length)];
}

// Get Referrer IP (placeholder)
function getReferrerIP() {
  return "192.168.0.1"; // Replace as needed
}

// Log normal visit
function logVisit() {
  getVisitorIP().then(ip => {
    const log = `Status Code: ${getRandomStatusCode()} | Sender IP: ${ip} | Referrer IP: ${getReferrerIP()}`;
    addLogEntry(log);
  });
}

// Broadcast clearing logs (placeholder for multi-client setups)
function broadcastClearLogs() {
  console.log("Broadcasting clear logs command");
}

// Log exfiltrated data
function logExfiltratedData(data) {
  addLogEntry(data, true);
}

// Event listeners
window.addEventListener("load", () => {
  retrieveLogsFromLocalStorage();
  logVisit();

  // Example: simulate exfiltration data after 3 seconds (remove or replace)
  setTimeout(() => {
    logExfiltratedData('{"username":"admin","password":"123456"}');
  }, 3000);
});

document.getElementById("clearLogs").addEventListener("click", clearLogs);
document.getElementById("downloadLogs").addEventListener("click", downloadLogs);

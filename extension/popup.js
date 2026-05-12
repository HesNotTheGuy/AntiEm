const threatLevelEl = document.getElementById("threatLevel");
const threatCountEl = document.getElementById("threatCount");
const purgeBtn = document.getElementById("purgeBtn");
const scanBtn = document.getElementById("scanBtn");
const toast = document.getElementById("toast");
const autoModeToggle = document.getElementById("autoMode");
const aggressiveToggle = document.getElementById("aggressive");
const lifetimeCountEl = document.getElementById("lifetimeCount");

function showToast(message, type) {
  toast.textContent = message;
  toast.className = "result-toast show " + type;
  setTimeout(() => {
    toast.className = "result-toast";
  }, 3000);
}

function updateThreatDisplay(count, level) {
  threatLevelEl.textContent = level;
  threatLevelEl.className = "threat-level threat-" + level.replace(" ", "-");
  if (count === 0) {
    threatCountEl.textContent = "This page is clean.";
  } else {
    threatCountEl.textContent = count + " em dash" + (count === 1 ? "" : "es") + " detected";
  }
}

function sendToTab(message) {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          resolve(response || {});
        });
      } else {
        resolve({});
      }
    });
  });
}

// Initial scan
sendToTab({ action: "getStats" }).then((res) => {
  if (res.count !== undefined) {
    updateThreatDisplay(res.count, res.threatLevel);
  } else {
    threatLevelEl.textContent = "N/A";
    threatCountEl.textContent = "Cannot scan this page";
  }
});

// Load lifetime stats
chrome.storage.local.get(["lifetimePurged"], (data) => {
  lifetimeCountEl.textContent = (data.lifetimePurged || 0).toLocaleString();
});

// Load settings
chrome.storage.sync.get(["autoMode", "aggressive"], (settings) => {
  autoModeToggle.checked = settings.autoMode || false;
  aggressiveToggle.checked = settings.aggressive || false;
});

// Purge button
purgeBtn.addEventListener("click", async () => {
  const aggressive = aggressiveToggle.checked;
  const res = await sendToTab({ action: "purge", aggressive });
  if (res.count > 0) {
    showToast(`Destroyed ${res.count} em dash${res.count === 1 ? "" : "es"}. You're welcome.`, "success");

    // Update lifetime
    chrome.storage.local.get(["lifetimePurged"], (data) => {
      const total = (data.lifetimePurged || 0) + res.count;
      chrome.storage.local.set({ lifetimePurged: total });
      lifetimeCountEl.textContent = total.toLocaleString();
    });
  } else {
    showToast("No em dashes found. This page is already pure.", "empty");
  }

  // Re-scan after purge
  const scanRes = await sendToTab({ action: "scan" });
  if (scanRes.count !== undefined) {
    updateThreatDisplay(scanRes.count, scanRes.threatLevel);
  }
});

// Scan button
scanBtn.addEventListener("click", async () => {
  const res = await sendToTab({ action: "scan" });
  if (res.count !== undefined) {
    updateThreatDisplay(res.count, res.threatLevel);
  }
});

// Settings toggles
autoModeToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ autoMode: autoModeToggle.checked });
});

aggressiveToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ aggressive: aggressiveToggle.checked });
});

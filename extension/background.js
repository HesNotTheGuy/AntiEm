// Track lifetime stats
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "autoPurge") {
    chrome.storage.local.get(["lifetimePurged"], (data) => {
      const total = (data.lifetimePurged || 0) + msg.count;
      chrome.storage.local.set({ lifetimePurged: total });
    });
  }
});

// Set defaults on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    autoMode: false,
    aggressive: false,
  });
  chrome.storage.local.set({
    lifetimePurged: 0,
  });
});

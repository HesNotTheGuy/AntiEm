const EM_DASH = "—";
const EN_DASH = "–";

let totalPurged = 0;

function walkTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}

function purgeNode(node, aggressive) {
  const original = node.nodeValue;
  let text = original;
  let count = 0;

  const emMatches = text.match(/—/g);
  if (emMatches) count += emMatches.length;
  text = text.replaceAll(EM_DASH, " - ");

  const doubleMatches = text.match(/--/g);
  if (doubleMatches) count += doubleMatches.length;
  text = text.replaceAll("--", " - ");

  if (aggressive) {
    const enMatches = text.match(/–/g);
    if (enMatches) count += enMatches.length;
    text = text.replaceAll(EN_DASH, "-");
  }

  text = text.replace(/ {2,}/g, " ");

  if (text !== original) {
    node.nodeValue = text;
  }

  return count;
}

function scanNode(node) {
  const text = node.nodeValue || "";
  let count = 0;
  const emMatches = text.match(/—/g);
  if (emMatches) count += emMatches.length;
  const doubleMatches = text.match(/--/g);
  if (doubleMatches) count += doubleMatches.length;
  return count;
}

function purge(aggressive) {
  const nodes = walkTextNodes(document.body);
  let count = 0;
  for (const node of nodes) {
    count += purgeNode(node, aggressive);
  }
  totalPurged += count;
  return count;
}

function scan() {
  const nodes = walkTextNodes(document.body);
  let count = 0;
  for (const node of nodes) {
    count += scanNode(node);
  }
  return count;
}

function getThreatLevel(count) {
  if (count === 0) return "ALL CLEAR";
  if (count > 20) return "CRITICAL";
  if (count > 10) return "SEVERE";
  if (count > 5) return "ELEVATED";
  return "GUARDED";
}

// Auto-purge if enabled
chrome.storage.sync.get(["autoMode", "aggressive"], (settings) => {
  if (settings.autoMode) {
    const count = purge(settings.aggressive || false);
    if (count > 0) {
      chrome.runtime.sendMessage({
        type: "autoPurge",
        count,
        url: location.href,
      });
    }
  }
});

// Listen for commands from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "purge") {
    const count = purge(msg.aggressive || false);
    sendResponse({ count, totalPurged });
  } else if (msg.action === "scan") {
    const count = scan();
    const threatLevel = getThreatLevel(count);
    sendResponse({ count, threatLevel });
  } else if (msg.action === "getStats") {
    const count = scan();
    const threatLevel = getThreatLevel(count);
    sendResponse({ count, threatLevel, totalPurged });
  }
  return true;
});

// Observe DOM for dynamically added em dashes (SPAs, infinite scroll, etc.)
chrome.storage.sync.get(["autoMode", "aggressive"], (settings) => {
  if (settings.autoMode) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            purgeNode(node, settings.aggressive || false);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const textNodes = walkTextNodes(node);
            for (const textNode of textNodes) {
              purgeNode(textNode, settings.aggressive || false);
            }
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
});

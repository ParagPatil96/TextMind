"use strict";
(() => {
  // src/options.ts
  document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["geminiKey"], (result) => {
      if (result.geminiKey) {
        document.getElementById("geminiKey").value = result.geminiKey;
      }
    });
    document.getElementById("save")?.addEventListener("click", () => {
      const key = document.getElementById("geminiKey").value;
      chrome.storage.local.set({ geminiKey: key }, () => {
        alert("Settings saved!");
      });
    });
  });
})();

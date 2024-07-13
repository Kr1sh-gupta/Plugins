document.addEventListener("DOMContentLoaded", () => {
    let video = document.querySelector("video");
    if (video) {
      video.addEventListener("ended", () => {
        chrome.runtime.sendMessage({ action: "switchTab" });
      });
    }
  });
  
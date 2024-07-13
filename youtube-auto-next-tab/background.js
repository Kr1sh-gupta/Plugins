chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "switchTab") {
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        let currentTabIndex = tabs.findIndex((tab) => tab.id === sender.tab.id);
        let nextTabIndex = (currentTabIndex + 1) % tabs.length;
        chrome.tabs.update(tabs[nextTabIndex].id, { active: true });
      });
    }
  
    if (request.action === "getVideoStatus") {
      chrome.tabs.query({ currentWindow: true, url: "*://www.youtube.com/watch*" }, (tabs) => {
        if (tabs.length > 0) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              let video = document.querySelector("video");
              return video ? { playing: !video.paused } : null;
            }
          }, (results) => {
            sendResponse(results[0].result);
          });
        } else {
          sendResponse(null);
        }
      });
      return true; // Indicates that the response is asynchronous
    }
  
    if (request.action === "togglePlayPause") {
      chrome.tabs.query({ currentWindow: true, url: "*://www.youtube.com/watch*" }, (tabs) => {
        if (tabs.length > 0) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              let video = document.querySelector("video");
              if (video) {
                if (video.paused) {
                  video.play();
                } else {
                  video.pause();
                }
              }
            }
          });
        }
      });
    }
  });
  
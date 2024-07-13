document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('status');
    const playPauseButton = document.getElementById('playPauseButton');
  
    chrome.runtime.sendMessage({ action: 'getVideoStatus' }, (response) => {
      if (response) {
        statusElement.textContent = response.playing ? 'Playing' : 'Paused';
      } else {
        statusElement.textContent = 'No YouTube video found';
        playPauseButton.disabled = true;
      }
    });
  
    playPauseButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'togglePlayPause' });
      chrome.runtime.sendMessage({ action: 'getVideoStatus' }, (response) => {
        if (response) {
          statusElement.textContent = response.playing ? 'Playing' : 'Paused';
        } else {
          statusElement.textContent = 'No YouTube video found';
          playPauseButton.disabled = true;
        }
      });
    });
  });
  
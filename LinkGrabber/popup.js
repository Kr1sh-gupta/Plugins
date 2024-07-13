document.addEventListener('DOMContentLoaded', function() {
    const linksList = document.getElementById('links-list');
    const newLinkName = document.getElementById('new-link-name');
    const newLinkUrl = document.getElementById('new-link-url');
    const addLinkButton = document.getElementById('add-link');
  
    // Load saved links from storage
    chrome.storage.sync.get('links', function(data) {
      const links = data.links || [];
      links.forEach(link => addLinkToList(link.name, link.url));
    });
  
    // Add a new link
    addLinkButton.addEventListener('click', function() {
      const name = newLinkName.value;
      const url = newLinkUrl.value;
      if (name && url) {
        addLinkToList(name, url);
        saveLink(name, url);
        newLinkName.value = '';
        newLinkUrl.value = '';
      }
    });
  
    // Add link to the list
    function addLinkToList(name, url) {
      const li = document.createElement('li');
      li.innerHTML = `<input type="text" class="link-name" value="${name}" readonly>
                      <input type="text" class="link-url" value="${url}" readonly>
                      <button class="copy-link">Copy</button>
                      <button class="edit-link">Edit</button>
                      <button class="delete-link">Delete</button>`;
      linksList.appendChild(li);
  
      // Copy link to clipboard
      li.querySelector('.copy-link').addEventListener('click', function() {
        const input = li.querySelector('.link-url');
        input.select();
        document.execCommand('copy');
        alert(`Copied the link: ${input.value}`);
      });
  
      // Edit link
      li.querySelector('.edit-link').addEventListener('click', function() {
        const nameInput = li.querySelector('.link-name');
        const urlInput = li.querySelector('.link-url');
        nameInput.removeAttribute('readonly');
        urlInput.removeAttribute('readonly');
        this.textContent = 'Save';
        this.classList.add('save-link');
        this.classList.remove('edit-link');
        this.removeEventListener('click', arguments.callee);
        this.addEventListener('click', function() {
          nameInput.setAttribute('readonly', true);
          urlInput.setAttribute('readonly', true);
          this.textContent = 'Edit';
          this.classList.add('edit-link');
          this.classList.remove('save-link');
          updateLink(nameInput.value, urlInput.value);
        });
      });
  
      // Delete link
      li.querySelector('.delete-link').addEventListener('click', function() {
        linksList.removeChild(li);
        deleteLink(name, url);
      });
    }
  
    // Save link to storage
    function saveLink(name, url) {
      chrome.storage.sync.get('links', function(data) {
        const links = data.links || [];
        links.push({ name, url });
        chrome.storage.sync.set({ links });
      });
    }
  
    // Update link in storage
    function updateLink(name, url) {
      chrome.storage.sync.get('links', function(data) {
        const links = data.links || [];
        const index = links.findIndex(link => link.name === name);
        if (index !== -1) {
          links[index].url = url;
          chrome.storage.sync.set({ links });
        }
      });
    }
  
    // Delete link from storage
    function deleteLink(name, url) {
      chrome.storage.sync.get('links', function(data) {
        let links = data.links || [];
        links = links.filter(link => link.name !== name || link.url !== url);
        chrome.storage.sync.set({ links });
      });
    }
  });
  
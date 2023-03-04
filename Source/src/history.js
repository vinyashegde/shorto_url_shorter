const historyTable = document.getElementById('history-table');
const clearHistoryButton = document.getElementById('clear-history-button');
const storageKey = 'shortenedUrls';

// Retrieve the shortened URLs from local storage and display them in the table
let shortenedUrls = JSON.parse(localStorage.getItem(storageKey)) || [];

function displayHistory() {
  // Get the shortened URLs from local storage
  let shortenedUrls = JSON.parse(localStorage.getItem(storageKey)) || [];

  // Clear the history table
  historyTable.innerHTML = '';

  // Add a new row for each shortened URL
  shortenedUrls.forEach(urlPair => {
    const row = document.createElement('tr');

    const longUrlCell = document.createElement('td');
    longUrlCell.textContent = urlPair[0].slice(0, 32) + (urlPair[0].length > 32 ? '...' : '');
    row.appendChild(longUrlCell);

    const shortUrlCell = document.createElement('td');
    const shortUrlLink = document.createElement('a');
    shortUrlLink.href = urlPair[1];
    shortUrlLink.textContent = urlPair[1];
    shortUrlLink.target = '_blank';
    shortUrlCell.appendChild(shortUrlLink);
    row.appendChild(shortUrlCell);

    historyTable.appendChild(row);
  });
}

shortenedUrls.forEach(urlPair => {
  const tr = document.createElement('tr');
  const shortUrlCell = document.createElement('td');
  const longUrlCell = document.createElement('td');

  const longUrl = urlPair[0];
  const shortUrl = urlPair[1];

  longUrlCell.textContent = longUrl.length > 32 ? longUrl.substring(0, 29) + '...' : longUrl;
  longUrlCell.title = longUrl;
  shortUrlCell.innerHTML = `<a href="${shortUrl}" target="_blank">${shortUrl}</a>`;

  tr.appendChild(longUrlCell);
  tr.appendChild(shortUrlCell);
  historyTable.appendChild(tr);
});

// Clear the history
clearHistoryButton.addEventListener('click', () => {
  localStorage.removeItem(storageKey);
  historyTable.innerHTML = '';
});
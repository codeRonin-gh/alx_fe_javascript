// Quotes array
const quotes = [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "In the middle of difficulty lies opportunity.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Design" }

  let quotes = [];

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Provide default quotes if none are saved
    quotes = [
      { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    ];
    saveQuotes(); // Save defaults
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}


// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = <p>"${quote.text}"</p><p><em>- ${quote.category}</em></p>;

  // Save last viewed quote to sessionStorage (optional)
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Function to add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }
 quotes.push({ text, category });
  saveQuotes();
  populateCategories();   //  dropdown
  filterQuotes();         // 
  alert("Quote added!");

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Add event listener for new quote button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  createAddQuoteForm();
  populateCategories();
  filterQuotes(); // Show quotes for saved category

  // Fetch from server once on page load
  fetchQuotesFromServer();

  // Optional: sync periodically every 30 seconds
  setInterval(fetchQuotesFromServer, 30000);
  // Start syncing every 30 seconds
  setInterval(fetchQuotesFromServer, 30000);
});
  // Optional: auto show last viewed quote
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById("quoteDisplay").innerHTML = <p>"${quote.text}"</p><p><em>- ${quote.category}</em></p>;
  }
});


//display randome quote
function displayRandomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  const quote = quotes[index];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = <p>"${quote.text}" — <em>${quote.category}</em></p>;
}

//create add quote function
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

//Export quotes to json
function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

//Import quotes from json
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (e) {
      alert("Failed to parse JSON.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

//filter quotes function //local storage
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes in this category.</p>";
    return;
  }

  filteredQuotes.forEach(quote => {
    const quoteEl = document.createElement("div");
    quoteEl.innerHTML = <p>"${quote.text}"</p><p><em>- ${quote.category}</em></p>;
    quoteDisplay.appendChild(quoteEl);
  });
}

//populate category function
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Remove all except the "All" option
  categoryFilter.innerHTML = <option value="all">All Categories</option>;

  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const lastSelected = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = lastSelected;
}
//fetch quotes from server
function fetchQuotesFromServer() {
  // Simulated server data
  const serverQuotes = [
    { text: "Learn from yesterday, live for today, hope for tomorrow.", category: "inspiration" },
    { text: "Simplicity is the soul of efficiency.", category: "productivity" }
  ];

  // Simulate fetching from server
  setTimeout(() => {
    let localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

    // Merge: remove duplicates
    const mergedQuotes = [...localQuotes];
    serverQuotes.forEach(serverQuote => {
      if (!localQuotes.some(q => q.text === serverQuote.text)) {
        mergedQuotes.push(serverQuote);
        notifyUser("New quote synced from server.");
      }
    });

    quotes = mergedQuotes;
    localStorage.setItem('quotes', JSON.stringify(quotes));

    populateCategories();
    filterQuotes();
  }, 1000); // Simulate delay
}

//conflict notification function
function notifyUser(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #444;
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    z-index: 1000;
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 4000);
}

// Async function to fetch quotes from JSONPlaceholder
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    // Map post titles as quotes and assign a category
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "server"
    }));

    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    // Merge quotes while avoiding duplicates
    const mergedQuotes = [...localQuotes];
    serverQuotes.forEach(serverQuote => {
      if (!localQuotes.some(q => q.text === serverQuote.text)) {
        mergedQuotes.push(serverQuote);
        notifyUser("New quote synced from server.");
      }
    });

    quotes = mergedQuotes;
    localStorage.setItem("quotes", JSON.stringify(quotes));

    populateCategories();
    filterQuotes();

  } catch (error) {
    console.error("Failed to fetch quotes from server:", error);
  }
}
   //sync quotes from server 
   function syncQuotesToServer() {
  const quotes = JSON.parse(localStorage.getItem("quotes") || "[]");

  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quotes)
  })
  .then(response => response.json())
  .then(data => {
    console.log("Quotes synced to server:", data);
    showNotification("Quotes synced with server!");
  })
  .catch(error => {
    console.error("Failed to sync quotes:", error);
  });
}

//show notification function
  function showNotification(message) {
  let notification = document.getElementById("syncNotification");

  if (!notification) {
    notification = document.createElement("div");
    notification.id = "syncNotification";
    notification.style.position = "fixed";
    notification.style.bottom = "10px";
    notification.style.right = "10px";
    notification.style.backgroundColor = "#4caf50";
    notification.style.color = "#fff";
    notification.style.padding = "10px";
    notification.style.borderRadius = "5px";
    notification.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    document.body.appendChild(notification);
  }

  notification.textContent = message;

  // Auto-hide after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
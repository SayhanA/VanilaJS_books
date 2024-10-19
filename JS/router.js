const routes = {
  "/": "pages/home.html",
  "/about": "pages/about.html",
  "/wishlist": "pages/wishlist.html",
};

function getPath() {
  const hash = window.location.hash;
  const path = hash.replace("#", "").split("?")[0] || "/";
  const queryString = hash.includes("?") ? hash.split("?")[1] : "";
  return { path, queryString };
}

function router() {
  const { path, queryString } = getPath();

  if (routes[path]) {
    if (path === "/books" && queryString.includes("book=")) {
      loadPage("pages/book-details.html", queryString);
    } else {
      loadPage(routes[path]);
    }
  } else {
    loadPage("pages/404.html");
  }
}

function loadPage(page, queryString = "") {
  const contentDiv = document.getElementById("content");

  contentDiv.classList.add("fade-out");

  setTimeout(() => {
    fetch(page)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((html) => {
        contentDiv.innerHTML = html;
        contentDiv.classList.remove("fade-out");
        contentDiv.classList.add("fade-in");

        setTimeout(() => contentDiv.classList.remove("fade-in"), 50);

        if (page === "pages/wishlist.html") {
          initializeWishlistPage();
        }

        if (page === "pages/book-details.html") {
          loadBookDetails(queryString);
        }
      })
      .catch((error) => {
        contentDiv.innerHTML =
          "<h1>Error loading page</h1><p>Sorry, something went wrong.</p>";
        console.error("There was an issue loading the page:", error);
      });
  }, 500);
}

// Function to fetch and display book details
function loadBookDetails(queryString) {
  const params = new URLSearchParams(queryString);
  const bookName = params.get("book");

  if (!bookName) {
    document.getElementById("content").innerHTML =
      "<p>Book not found. Please try again.</p>";
    return;
  }

  const books = JSON.parse(localStorage.getItem("booksData")) || [];
  const book = books.find(
    (b) => b.title.toLowerCase() === decodeURIComponent(bookName).toLowerCase()
  );

  if (!book) {
    document.getElementById("content").innerHTML =
      "<p>Book not found in our records.</p>";
    return;
  }

  // Display the book details dynamically
  const bookDetailsHtml = `
    <div class="book-details">
      <img src="${
        book.formats["image/jpeg"] || "placeholder-image-url.jpg"
      }" alt="${book.title}" />
      <h1>${book.title}</h1>
      <p>Author(s): ${book.authors.map((author) => author.name).join(", ")}</p>
      <p>ID: ${book.id}</p>
      <p>Download Count: ${book.download_count}</p>
      <p>Description: ${
        book.description || "No description available."
      }</p> <!-- Assuming 'description' is available -->
    </div>
  `;

  document.getElementById("content").innerHTML = bookDetailsHtml;
}

// Event listeners for routing
window.addEventListener("hashchange", router);
window.addEventListener("load", router);

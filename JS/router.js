const routes = {
  "/": "pages/home.html",
  "/about": "pages/about.html",
  "/books": "pages/books.html",
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

        // Access DOM elements here, after content is loaded
        if (page === "pages/wishlist.html") {
          initializeWishlistPage(); // Call a function to handle wishlist logic
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

// Event listeners for routing
window.addEventListener("hashchange", router);
window.addEventListener("load", router);

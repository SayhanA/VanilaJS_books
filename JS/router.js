const routes = {
  "/": "pages/home.html",
  "/about": "pages/about.html",
  "/books": "pages/books.html",
  "/wishlist": "pages/wishlist.html",
};

function router() {
  const path = window.location.hash.replace("#", "") || "/";

  if (routes[path]) {
    loadPage(routes[path]);
  } else {
    loadPage("pages/404.html");
  }
}

function loadPage(page) {
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

        setTimeout(() => contentDiv.classList.remove("fade-in"), 500);

        if (page === "pages/books.html") {
          fetchBooks();
        }
      })
      .catch((error) => {
        contentDiv.innerHTML =
          "<h1>Error loading page</h1><p>Sorry, something went wrong.</p>";
        console.error("There was an issue loading the page:", error);
      });
  }, 500);
}

window.addEventListener("hashchange", router);

window.addEventListener("load", router);

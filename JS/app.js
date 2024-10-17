console.log("book js file...........");
const apiUrl = "https://gutendex.com/books/";
const loadingElement = document.getElementById("loading");

async function fetchBooks() {
  try {
    const response = await fetch(apiUrl);
    console.log("data response:", response);

    if (!response.ok) {
      throw new Error("Failed to fetch data from API");
    }

    const data = await response.json();
    if (data) {
      const books = data.results;
      // Save books data to localStorage
      localStorage.setItem("booksData", JSON.stringify(books));
    }

    const itemsPerPage = 8;
    let currentPage = 1;

    displayItems(currentPage, itemsPerPage, data?.results);
    setTimeout(() => {
      let totalItems = data?.results.length;
      console.log({ totalItems });
      setupPagination(totalItems, itemsPerPage, currentPage, data?.results);
    }, 100);

    // displayBooks(data.results.slice(0, 8));
  } catch (error) {
    console.error("Error fetching the books:", error);
    document.getElementById(
      "content"
    ).innerHTML = `<p>Error loading books. Please try again later.</p>`;
  }
}

function displayBooks(books) {
  console.log({ books });
  const contentArea = document.getElementById("content");

  if (!contentArea) {
    console.error("Content area not found");
    return;
  }

  contentArea.innerHTML = "";

  const booksContainer = document.createElement("div");
  booksContainer.classList.add("book-list");

  books.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("book-item");

    const imageUrl = book.formats["image/jpeg"] || "placeholder-image-url.jpg";
    bookItem.innerHTML = `
      <img src="${imageUrl}" alt="${book.title}" />
      <div class="book_content">
        <h5>${book.title}</h3>
        <p>Author: ${
          book.authors.map((author) => author.name).join(", ") || "Unknown"
        }</p>
        <p>ID: ${book.id}</p>
      </div>
    `;

    booksContainer.appendChild(bookItem);
  });

  contentArea.appendChild(booksContainer);
}

// pagination functions

fetchBooks();

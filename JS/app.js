console.log("book js file...........");
const apiUrl = "https://gutendex.com/books/";
const loadingElement = document.getElementsByClassName("loading")[0];
let booksData = [];

document.getElementById("navgate_home").addEventListener("click", () => {
  fetchBooks();
});

async function fetchBooks() {
  try {
    loadingElement.style.display = "block";

    const books = JSON.parse(localStorage.getItem("booksData"));

    if (books) booksData = books;

    if (!books) {
      const response = await fetch(apiUrl);
      console.log("data response:", response);

      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }

      const data = await response.json();
      booksData = data?.results;
      localStorage.setItem("booksData", JSON.stringify(booksData));
    }
    populateGenreOptions();

    const itemsPerPage = 8;
    let currentPage = 1;
    loadingElement.style.display = "none";
    setTimeout(() => {
      displayItems(currentPage, itemsPerPage, booksData);
      let totalItems = booksData.length;
      console.log({ totalItems });
      setupPagination(totalItems, itemsPerPage, currentPage, booksData);
    }, 1000);
  } catch (error) {
    console.error("Error fetching the books:", error);
    document.getElementById(
      "content"
    ).innerHTML = `<p>Error loading books. Please try again later.</p>`;
  }
}

function populateGenreOptions() {
  const filterOptions = document.getElementById("filterOptions");
  const genres = new Set();
  booksData.forEach((book) => {
    if (book.subjects) {
      book.subjects.forEach((subject) => {
        genres.add(subject);
      });
    }
  });

  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    filterOptions.appendChild(option);
  });
}

document
  .getElementById("filterOptions")
  .addEventListener("change", function () {
    show(false);
    const selectedGenre = this.value;
    console.log({ selectedGenre });
    if (selectedGenre) {
      const filteredBooks = booksData.filter((book) => {
        return book.subjects && book.subjects.includes(selectedGenre);
      });

      const sortedBooks = filteredBooks.sort((a, b) => {
        return b.download_count - a.download_count;
      });

      displayBooks(sortedBooks);
    } else {
      displayBooks(booksData);
    }
  });

setTimeout(() => {
  console.log(document.getElementById("home_content"));
}, 1000);

function displayBooks(books) {
  console.log({ books });
  setTimeout(() => {
    const contentArea = document.getElementById("home_content");

    if (!contentArea) {
      // console.error("Content area not found");
      return;
    }

    contentArea.innerHTML = "";

    const booksContainer = document.createElement("div");
    booksContainer.classList.add("book-list");

    books.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.classList.add("book-item");

      const bookName = encodeURIComponent(book.title);
      const book_href = `#/books?book=${bookName}`;

      const imageUrl =
        book.formats["image/jpeg"] || "placeholder-image-url.jpg";
      bookItem.innerHTML = `
    <button class="add-to-btn" data-id="${book.id}">
        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        </button>

        <img class="book-img" src="${imageUrl}" alt="${book.title}" />
        <div class="book_content">
        <a href=${book_href}>
          <h5>${book.title.slice(0, 50)}</h5>
          </a>
          <p>Author: ${
            book.authors.map((author) => author.name).join(", ") || "Unknown"
          }</p>
          <p>ID: ${book.id}</p>
        </div>
          
      `;

      // bookLink.appendChild(bookItem);

      booksContainer.appendChild(bookItem);

      bookItem
        .querySelector(".add-to-btn")
        .addEventListener("click", function () {
          addToWishlist(book);
        });
    });

    contentArea.appendChild(booksContainer);
  }, 1000);
}

function show(show) {
  const pagination = document.getElementById("pagination");
  if (show) pagination.style.display = "flex";
  else pagination.style.display = "none";
}
// pagination functions

fetchBooks();

function updateCartNumber() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const cartNumber = document.getElementById("cartNumber");

  cartNumber.textContent = wishlist.length;
}

// Initialize the cart number on page load
window.addEventListener("load", updateCartNumber);

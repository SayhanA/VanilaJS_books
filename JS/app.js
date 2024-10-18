console.log("book js file...........");
const apiUrl = "https://gutendex.com/books/";
const loadingElement = document.getElementsByClassName("loading")[0];
let booksData = [];

async function fetchBooks() {
  try {
    loadingElement.style.display = "block";
    const response = await fetch(apiUrl);
    console.log("data response:", response);

    if (!response.ok) {
      throw new Error("Failed to fetch data from API");
    }

    const data = await response.json();
    if (data) {
      booksData = data.results;
      localStorage.setItem("booksData", JSON.stringify(booksData));
    }
    populateGenreOptions();

    const itemsPerPage = 8;
    let currentPage = 1;
    loadingElement.style.display = "none";
    displayItems(currentPage, itemsPerPage, booksData);
    setTimeout(() => {
      let totalItems = booksData.length;
      console.log({ totalItems });
      setupPagination(totalItems, itemsPerPage, currentPage, booksData);
    }, 100);
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

function displayBooks(books) {
  console.log({ books });
  const contentArea = document.getElementById("home_content");

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

    const bookLink = document.createElement("a");
    const bookName = encodeURIComponent(book.title);
    bookLink.href = `#/books?book=${bookName}`;

    const imageUrl = book.formats["image/jpeg"] || "placeholder-image-url.jpg";
    bookItem.innerHTML = `
        <img src="${imageUrl}" alt="${book.title}" />
        <div class="book_content">
          <h5>${book.title}</h5>
          <p>Author: ${
            book.authors.map((author) => author.name).join(", ") || "Unknown"
          }</p>
          <p>ID: ${book.id}</p>
          
        </div>
      `;

    bookLink.appendChild(bookItem);

    booksContainer.appendChild(bookLink);
  });

  contentArea.appendChild(booksContainer);
}

function show(show) {
  const pagination = document.getElementById("pagination");
  if (show) pagination.style.display = "flex";
  else pagination.style.display = "none";
}
// pagination functions

fetchBooks();

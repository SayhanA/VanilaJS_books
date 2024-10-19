const resultsContainer = document.getElementById("results");
const searchInput = document.getElementById("search");

searchInput.addEventListener("focus", function () {
  resultsContainer.style.display = "none";
});

searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  console.log({ query });

  // resultsContainer.innerHTML = "";

  if (query.length > 0) {
    const books = JSON.parse(localStorage.getItem("booksData"));
    console.log({ books });

    const filteredBooks = books.filter((book) => {
      const title = book.title.toLowerCase();
      const authors = book.authors.map((author) => author.name.toLowerCase());
      return (
        title.includes(query) ||
        authors.some((author) => author.includes(query))
      );
    });

    if (filteredBooks.length > 0) {
      filteredBooks.forEach((book) => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");

        const bookElement = document.createElement("a");
        const bookName = encodeURIComponent(book.title);
        bookElement.href = `#/books?book=${bookName}`;
        bookElement.classList.add("book_title");

        const bookTitle = document.createElement("h5");
        bookTitle.textContent = book.title;

        const bookAuthor = document.createElement("p");
        const authors = book.authors.map((author) => author.name).join(", ");
        bookAuthor.textContent = `Author(s): ${authors}`;

        bookElement.appendChild(bookTitle);
        bookDiv.append(bookElement);
        bookDiv.appendChild(bookAuthor);
        resultsContainer.appendChild(bookDiv);
      });
    } else {
      resultsContainer.innerHTML = "<p>No books found.</p>";
    }

    resultsContainer.style.display = "block";
  } else {
    // resultsContainer.innerHTML = "<p>Please enter a search query.</p>";
    resultsContainer.style.display = "none";
  }
});

document.addEventListener("click", function (event) {
  if (
    !searchInput.contains(event.target) &&
    !resultsContainer.contains(event.target)
  ) {
    resultsContainer.style.display = "none";
  }
});

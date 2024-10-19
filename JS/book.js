// Function to fetch and display book details
function loadBookDetails(queryString) {
  const params = new URLSearchParams(queryString);
  const bookName = params.get("book");

  if (!bookName) {
    document.getElementById("book-details-container").innerHTML =
      "<p>Book not found. Please try again.</p>";
    return;
  }

  const books = JSON.parse(localStorage.getItem("booksData")) || [];
  const book = books.find(
    (b) => b.title.toLowerCase() === decodeURIComponent(bookName).toLowerCase()
  );

  if (!book) {
    document.getElementById("book-details-container").innerHTML =
      "<p>Book not found in our records.</p>";
    return;
  }

  getRelatedBooks(book, books);

  const downloads = book.download_count;
  let rating = 0;
  if (downloads > 1000000) rating = 5;
  else if (downloads > 500000) rating = 4;
  else if (downloads > 100000) rating = 3;
  else if (downloads > 10000) rating = 2;
  else if (downloads > 0) rating = 1;

  // Generate star rating HTML
  const starRatingHtml = generateStarRating(rating);

  // Display the book details dynamically
  const bookDetailsHtml = `
    <div class="book-details">
        <div>
            <img class="book_img" src="${
              book.formats["image/jpeg"] || "placeholder-image-url.jpg"
            }" alt="${book.title}" />
            <div>
                <h2>${book.title}</h2>
                <p class="ratings">${starRatingHtml}</p>
                <p><strong>Author(s):</strong> ${book.authors
                  .map(
                    (author) =>
                      `${author.name} (${author.birth_year} - ${
                        author.death_year || "present"
                      })`
                  )
                  .join(", ")}
                </p>
                <p><strong>ID:</strong> ${book.id}</p>
                <p><strong>Download Count:</strong> ${book.download_count}</p>
                <p><strong>Subjects:</strong> ${book.subjects.join(", ")}</p>
                <p><strong>Language:</strong> ${book.languages.join(", ")}</p>
                <div class="downloads">
                  <a href="${
                    book.formats["application/epub+zip"]
                  }" download>Download EPUB</a>
                    <a href="${
                      book.formats["text/plain; charset=us-ascii"]
                    }" download>Download Plain Text</a>
                </div>
            </div>
        </div>
        <p><strong>Description:</strong> ${
          book.description || "No description available."
        }</p>
        
    </div>
  `;

  document.getElementById("book-details-container").innerHTML = bookDetailsHtml;
}

function generateStarRating(rating) {
  let starHtml = "";
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      starHtml += `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="orange" width="24" height="24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>`;
    } else {
      starHtml += `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gray" width="24" height="24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>`;
    }
  }
  return starHtml;
}

function getRelatedBooks(currentBook, allBooks) {
  const currentBookSubjects = currentBook.subjects || [];
  const currentBookBookshelves = currentBook.bookshelves || [];

  const relatedBooks = allBooks.filter((book) => {
    if (book.id === currentBook.id) return false; // Exclude the current book itself

    const hasRelatedSubject = book.subjects.some((subject) =>
      currentBookSubjects.includes(subject)
    );
    const hasRelatedBookshelf = book.bookshelves.some((bookshelf) =>
      currentBookBookshelves.includes(bookshelf)
    );

    return hasRelatedSubject || hasRelatedBookshelf;
  });
  renderRelatedBooks(relatedBooks.slice(0, 4));
  return relatedBooks;
}

function renderRelatedBooks(relatedBooks) {
  const container = document.getElementById("related_books");
  relatedBooks.forEach((book) => {
    const bookName = encodeURIComponent(book.title);
    const book_href = `#/books?book=${bookName}`;
    const bookElement = document.createElement("div");
    bookElement.classList.add("related-book");

    bookElement.innerHTML = `
        <img src="${book.formats["image/jpeg"]}" alt="${book.title} cover">
        <p>${book.title}</p>
        <a href=${book_href}>View Details</a>
      `;

    container.appendChild(bookElement);
  });
}

let wishlistContentDiv;

function addToWishlist(book) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  let bookInWishlist = wishlist.find((b) => b.book.id === book.id);

  if (bookInWishlist) {
    bookInWishlist.quantity += 1;
    pop_up(`${book.title} quantity increased to ${bookInWishlist.quantity}`);
  } else {
    wishlist.push({ book, quantity: 1 });
    pop_up(`${book.title} added to your wishlist`);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateCartNumber();
}

function initializeWishlistPage() {
  loadingElement.style.display = "none";
  const wishlistContentDiv = document.getElementById("wishlist-content");
  if (wishlistContentDiv) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlist.length === 0) {
      wishlistContentDiv.innerHTML = "<p>Your wishlist is empty.</p>";
      return;
    }

    let tableHtml = `
      <table>
        <thead>
          <tr>
            <th> No. </th>
            <th> Image </th>
            <th>Title</th>
            <th>Author(s)</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
    `;

    wishlist.forEach((item, index) => {
      const { book, quantity } = item;
      const imageUrl =
        book.formats["image/jpeg"] || "placeholder-image-url.jpg";
      tableHtml += `
        <tr>
        <td> ${index + 1} </td>
        <td> <img src=${imageUrl} </td>
          <td><p class="book-title">${book.title}</p></td>
          <td>${book.authors.map((author) => author.name).join(", ")}</td>
          <td><button onclick="decreaseQuantity(${book.id})">−</button>
            ${quantity}
            <button onclick="increaseQuantity(${book.id})">+</button></td>
          <td><button class="remote_button" onclick="removeFromWishlist(${
            book.id
          })"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
</button></td>
        </tr>
      `;
    });

    tableHtml += `
        </tbody>
      </table>
    `;

    wishlistContentDiv.innerHTML = tableHtml;
  } else {
    console.error("Wishlist content div not found.");
  }
}

function increaseQuantity(bookId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlist = wishlist.map((item) => {
    if (item.book.id === bookId) {
      return { ...item, quantity: item.quantity + 1 };
    }
    return item;
  });

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  initializeWishlistPage();
}

function decreaseQuantity(bookId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlist = wishlist.map((item) => {
    if (item.book.id === bookId && item.quantity > 1) {
      return { ...item, quantity: item.quantity - 1 };
    }
    return item;
  });

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  initializeWishlistPage();
}

function removeFromWishlist(bookId) {
  deleteModal(() => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    wishlist = wishlist.filter((item) => item.book.id !== bookId);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    initializeWishlistPage();
    updateCartNumber();

    pop_up("Book removed from your wishlist", "success");
  });
}

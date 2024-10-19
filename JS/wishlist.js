function addToWishlist(book) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (!wishlist.some((b) => b.id === book.id)) {
    wishlist.push(book);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    pop_up(`${book.title} added to your wishlist!`);
  } else {
    pop_up(`${book.title} is already in your wishlist!`, "warning");
  }
}

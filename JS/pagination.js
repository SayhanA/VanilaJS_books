function displayItems(page, itemsPerPage, data) {
  const content = document.getElementById("content");
  //   content.innerHTML = "";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  console.log({ start, end });

  displayBooks(data.slice(start, end));
}

function setupPagination(totalItems, itemsPerPage, currentPage, data) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      displayItems(currentPage, itemsPerPage, data);
      updateButtons(currentPage, pageCount, data);
    }
  });
  pagination.appendChild(prevButton);

  for (let i = 1; i <= pageCount; i++) {
    const button = document.createElement("button");
    button.textContent = i;

    if (i === currentPage) {
      button.classList.add("active");
    }

    button.addEventListener("click", function () {
      currentPage = i;
      displayItems(currentPage, itemsPerPage, data);

      document.querySelectorAll("#pagination button").forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");

      prevButton.disabled = currentPage === 1;
      nextButton.disabled = currentPage === pageCount;
    });

    pagination.appendChild(button);
  }

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === pageCount;
  nextButton.addEventListener("click", function () {
    if (currentPage < pageCount) {
      currentPage++;
      displayItems(currentPage, itemsPerPage, data);
      updateButtons(currentPage, pageCount, data);
    }
  });
  pagination.appendChild(nextButton);
}

function updateButtons(currentPage, pageCount, data) {
  const pagination = document.getElementById("pagination");

  const prevButton = pagination.querySelector("button:first-child");
  const nextButton = pagination.querySelector("button:last-child");

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === pageCount;

  document.querySelectorAll("#pagination button").forEach((btn, index) => {
    if (index > 0 && index <= pageCount) {
      btn.classList.remove("active");
      if (parseInt(btn.textContent) === currentPage) {
        btn.classList.add("active");
      }
    }
  });
}

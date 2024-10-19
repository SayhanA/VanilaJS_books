function pop_up(content, status = "success") {
  const modalEle = document.createElement("div");
  modalEle.classList.add("popup_modal");
  modalEle.innerHTML = ` <svg class="check_icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
 <span> ${content}</span>`;

  modalEle.style.bottom = "-100%";
  modalEle.style.position = "fixed";
  modalEle.style.left = "50%";
  modalEle.style.transform = "translateX(-50%)";
  modalEle.style.transition = "bottom 2s ease-in-out";

  if (status === "success") {
    modalEle.style.border = "2px solid #40ff40";
    modalEle.style.color = "#40ff40";
  } else if (status === "warning") {
    modalEle.style.border = "2px solid orange";
    modalEle.style.color = "orange";
  } else if (status === "error") {
    modalEle.style.border = "2px solid red";
    modalEle.style.color = "red";
  }

  document.body.appendChild(modalEle);

  setTimeout(() => {
    modalEle.style.bottom = "2%";
  }, 1);

  setTimeout(() => {
    modalEle.style.bottom = "-100%";

    setTimeout(() => {
      modalEle.remove();
    }, 2000);
  }, 4000);
}

function deleteModal(onConfirm) {
  document.body.style.overflow = "hidden";

  const overlay = document.createElement("div");
  overlay.classList.add("modal_overlay");

  const createModalElement = document.createElement("div");
  createModalElement.classList.add("delete_modal");

  createModalElement.innerHTML = `
    <button type="button" class="remove_svg">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>

    <h2> Are you sure? </h2>
    <p>Do you really want to delete this record? This process cannot be undone.</p>

    <div id="confirm_buttons">
      <button type="button" id="btn_cancel">Cancel</button>
      <button type="button" id="btn_delete">Delete</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(createModalElement);

  document.body.style.backgroundColor = "#00000060";
  document.body.style.transition = "all 0.5s";

  document.getElementById("btn_cancel").addEventListener("click", () => {
    closeModal(createModalElement, overlay);
  });

  document.getElementById("btn_delete").addEventListener("click", () => {
    closeModal(createModalElement, overlay);
    onConfirm();
  });

  document.querySelector(".remove_svg").addEventListener("click", () => {
    closeModal(createModalElement, overlay);
  });

  function closeModal(modal, overlay) {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
    document.body.style.overflow = "";
    document.body.style.backgroundColor = "";
  }
}

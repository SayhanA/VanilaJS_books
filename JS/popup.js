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

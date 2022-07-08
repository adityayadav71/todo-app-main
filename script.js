const toDoInput = document.querySelector(".to-do-input-box");
const toDoList = document.querySelector(".to-do");
const deleteBtn = document.querySelectorAll(".delete");
const toDo = document.getElementsByClassName("to-do-input");
const filterBtn = document.querySelectorAll(".filter");
const clearBtn = document.querySelector(".clear-to-do");
const checkboxes = document.getElementsByClassName("checkbox");
const left = document.getElementsByClassName("left-to-do");

function updateCount() {
  Array.from(left).forEach((l) => {
    let items = 0;
    Array.from(toDo).forEach((t) => {
      if (t.parentElement.classList.contains("to-do")) items++;
    });
    l.textContent = `${items} items`;
  });
}

function fillEmptyToDoList() {
  const html = `
    <div class="no-items">
        <p class="no-items">Your to do list is empty...</p>
    </div>
  `;
  toDoList.insertAdjacentHTML("beforeend", html);
}

function checkEmptyList() {
  const children = Array.from(toDoList.children);
  const notEmpty = [...children].some((child) =>
    child.classList.contains("to-do-input")
  );
  if (!notEmpty) fillEmptyToDoList();
  else document.querySelector(".no-items")?.remove();
}
checkEmptyList();

Array.from(filterBtn).forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const children = Array.from(e.target.closest(".filter").children);
    children.forEach((child) => {
      child.classList.remove("filter-active");
    });
    e.target.classList.add("filter-active");
  });
});

clearBtn.addEventListener("click", function () {
  Array.from(checkboxes).forEach((box) => {
    if (box.checked && box.parentElement.classList.contains("to-do-input")) {
      box.parentElement.remove();
    }
  });
  updateCount();
});

toDoInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const html = `
      <div class="to-do-input">
        <input type="checkbox" id="checkbox-${
          toDo.length + 1
        }" class="checkbox" />
        <label for="checkbox-${toDo.length + 1}" class="checkbox-label">${
      toDoInput.value
    }</label>
        <button class="delete">
          <img class="delete" src="images/icon-cross.svg" alt="delete-this-to-do" />
        </button>
      </div>
    `;
    toDoList.insertAdjacentHTML("beforeend", html);
    toDoInput.value = "";
    updateCount();
    checkEmptyList();
  }
});

toDoList.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    e.target.closest(".to-do-input")?.remove();
  }
  checkEmptyList();
  updateCount();
});

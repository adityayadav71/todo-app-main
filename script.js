const toDoInput = document.querySelector(".to-do-input-box");
const toDoList = document.querySelector(".to-do");
let deleteBtn = document.querySelectorAll(".delete");
let toDo = document.querySelectorAll(".to-do-input");
const filterBtn = document.querySelector(".filter-container");
const clearBtn = document.querySelector(".clear-to-do");

checkEmptyList();

function fillEmptyToDoList() {
  const html = `
    <div class="to-do-input no-items">
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
}

filterBtn.addEventListener("click", function (e) {
  const children = Array.from(e.target.closest(".filter").children);
  children.forEach((child) => {
    child.classList.remove("filter-active");
  });
  e.target.classList.add("filter-active");
});

clearBtn.addEventListener("click", function () {
  toDo.forEach((el) => {
    if (el.parentElement === toDoList) el.remove();
  });
  checkEmptyList();
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
    checkEmptyList();
  }
});

toDoList.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    e.target.closest(".to-do-input")?.remove();
  }
  checkEmptyList();
});

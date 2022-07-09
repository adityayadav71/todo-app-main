const toDoInput = document.querySelector(".to-do-input-box");
const toDoList = document.querySelector(".to-do");
const deleteBtn = document.querySelectorAll(".delete");
const toDo = document.getElementsByClassName("to-do-input");
const filterBtn = document.querySelectorAll(".filter");
const clearBtn = document.querySelector(".clear-to-do");
const checkboxes = document.getElementsByClassName("checkbox");
const left = document.getElementsByClassName("left-to-do");
const themeSwitch = document.querySelector(".theme-btn");
const bgImage = document.querySelector(".background-image");
const themeIcon = document.querySelector(".theme-icon");

themeSwitch.addEventListener("click", switchTheme);
function switchTheme() {
  if (!document.body.classList.contains("light-theme")) {
    // Change background image
    bgImage.src = "public/images/bg-desktop-light.jpg";
    // Change Theme button icon
    themeIcon.src = "public/images/icon-moon.svg";
    // Change body classList
    document.body.classList.add("light-theme");
  } else {
    // Change background image
    bgImage.src = "public/images/bg-desktop-dark.jpg";
    // Change Theme button icon
    themeIcon.src = "public/images/icon-sun.svg";
    // Change body classList
    document.body.classList.remove("light-theme");
  }
}

function updateCount() {
  Array.from(left).forEach((l) => {
    let items = 0;
    Array.from(toDo).forEach((t) => {
      if (t.parentElement.classList.contains("to-do")) items++;
    });
    l.textContent = `${items} items left`;
  });
}

function fillEmptyToDoList() {
  const html = `
    <div class="no-items">
        <p >Your to do list is empty...</p>
    </div>
  `;
  toDoList.insertAdjacentHTML("beforeend", html);
}

function emptyFilled() {
  const children = Array.from(toDoList.children);
  const filled = [...children].some((child) =>
    child.classList.contains("no-items")
  );
  return filled;
}

function checkEmptyList() {
  const children = Array.from(toDoList.children);
  const empty = ![...children].some((child) =>
    child.classList.contains("to-do-input")
  );
  if (empty) {
    fillEmptyToDoList();
    clearBtn.style.display = "none";
    filterBtn[0].style.display = "none";
    filterBtn[1].style.display = "none";
  } else {
    clearBtn.style.display = "flex";
    filterBtn[0].style.display = "flex";
    filterBtn[1].style.display = "flex";
    document.querySelector(".no-items")?.remove();
  }
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
  checkEmptyList();
  updateCount();
});

toDoInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    if (toDoInput.value === "") return;
    const html = `
      <div class="to-do-input">
        <input type="checkbox" id="checkbox-${
          toDo.length + 1
        }" class="checkbox" />
        <label for="checkbox-${toDo.length + 1}" class="checkbox-label">${
      toDoInput.value
    }</label>
        <button class="delete">
          <img class="delete" src="/images/icon-cross.svg" alt="delete-this-to-do" />
        </button>
      </div>
    `;
    fetch("/addToDo", {
      method: "POST",

      body: JSON.stringify({
        username: "ay",
        toDo: "toDoInput.value",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    toDoList.insertAdjacentHTML("beforeend", html);
    toDoInput.value = "";
    updateCount();
    checkEmptyList();
  }
});

toDoList.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    e.target.closest(".to-do-input")?.remove();
    checkEmptyList();
    updateCount();
  }
});

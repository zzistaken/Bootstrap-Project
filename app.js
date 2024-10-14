// Selecting all elements
const form = document.getElementById("todoForm");
const addInput = document.getElementById("addTodoInput");
const addButton = document.getElementById("addTodoButton");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const searchInput = document.getElementById("searchTodoInput");
const clearButton = document.getElementById("clearTodosButton");

function eventListeners() {
  form.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
  secondCardBody.addEventListener("click", deleteTodo);
  searchInput.addEventListener("keyup", filterTodos);
  clearButton.addEventListener("click", clearAllTodos);
}
function getTodosFromStorage() {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  return todos;
}
function loadAllTodosToUI() {
  let todos = getTodosFromStorage();

  todos.forEach((todo) => {
    addTodoToUI(todo);
  });
}
function addTodo(e) {
  const newTodo = addInput.value.trim();

  if (newTodo === "") {
    showAlert(
      "danger",
      "Please enter a todo.",
      `<i class="fa-solid fa-triangle-exclamation me-2"></i>`
    );
  } else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert(
      "success",
      "Todo added to the list!",
      `<i class="fa-solid fa-circle-check me-2"></i>`
    );
  }

  e.preventDefault();
}
function addTodoToUI(newTodo) {
  const listItem = document.createElement("li");

  listItem.className =
    "list-group-item d-flex justify-content-between align-items-center";

  const link = document.createElement("a");

  link.className = "deleteTodoButton";
  link.innerHTML = `<i class="fa-regular fa-trash-can text-danger" style="cursor: pointer;"></i>`;

  listItem.appendChild(document.createTextNode(newTodo));
  listItem.appendChild(link);
  todoList.appendChild(listItem);

  addInput.value = "";
}
function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}
function deleteTodo(e) {
  if (e.target.parentElement.className === "deleteTodoButton") {
    if (
      confirm(
        `Are you sure you want to delete ` +
          e.target.parentElement.parentElement.textContent +
          ` ?`
      ) == true
    ) {
      e.target.parentElement.parentElement.remove();
      deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
      showAlert(
        "success",
        "Todo has been deleted from the list!",
        `<i class="fa-solid fa-circle-check me-2"></i>`
      );
    }
  }
}
function deleteTodoFromStorage(deleteTodo) {
  let todos = getTodosFromStorage();

  todos.forEach((todo, index) => {
    if (todo === deleteTodo) {
      todos.splice(index, 1);
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}
function filterTodos(e) {
  const filterValue = e.target.value.toLowerCase();
  const listItems = document.querySelectorAll(".list-group-item");

  listItems.forEach(function (listItem) {
    const text = listItem.textContent.toLowerCase();

    if (text.indexOf(filterValue) === -1) {
      listItem.setAttribute("style", "display:none !important");
    } else {
      listItem.setAttribute("style", "display:block");
    }
  });
}
function clearAllTodos() {
  if (confirm("Are you sure you want to clear the entire list?")) {
    while (todoList.firstElementChild != null) {
      todoList.removeChild(todoList.firstElementChild);
    }
    localStorage.removeItem("todos");
    showAlert(
      "success",
      "All todos has been deleted from the list!",
      `<i class="fa-solid fa-circle-check me-2"></i>`
    );
  }
}
function showAlert(type, message, icon) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} d-flex align-items-center mt-2 mb-0`;
  alert.innerHTML = `${icon} ${message}`;

  firstCardBody.appendChild(alert);

  setTimeout(function () {
    alert.remove();
  }, 1500);
}

eventListeners();

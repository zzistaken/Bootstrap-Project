const form = document.getElementById("todoForm");
const addInput = document.getElementById("addTodoInput");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const searchInput = document.getElementById("searchTodoInput");
const secondCardBody = document.querySelectorAll(".card-body")[1];
const list = document.getElementById("todoList");
const emptyText = document.getElementById("emptyText");
const clearButton = document.getElementById("clearTodosButton");

const eventListeners = () => {
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
  form.addEventListener("submit", addTodo);
  searchInput.addEventListener("keyup", filterTodo);
  secondCardBody.addEventListener("click", deleteTodo);
  clearButton.addEventListener("click", clearAllTodos);
};

const loadAllTodosToUI = () => {
  let todos = getTodosFromStorage();

  todos.forEach((todo) => {
    addTodoToUI(todo);
  });
  checkEmpty();
};
const getTodosFromStorage = () => {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
};
const addTodo = e => {
  const newTodo = addInput.value.trim();

  if (addInput.value.trim() === "") {
    showAlert("danger", "Please enter a todo!");
    addInput.value = "";
  } else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert("success", "Todo added to list!");
    addInput.value = "";
    checkEmpty();
  }
  e.preventDefault();
};
const addTodoToUI = newTodo => {
  const listItem = document.createElement("li");

  listItem.className =
    "list-group-item d-flex justify-content-between align-items-center";
  listItem.innerHTML = `${newTodo} <a href="#" class="deleteButton"><i class="fa-solid fa-trash-can text-danger"></i></a>`;
  list.appendChild(listItem);
};
const addTodoToStorage = newTodo => {
  let todos = getTodosFromStorage();

  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
};
const filterTodo = e => {
  const filterValue = e.target.value.toLowerCase();
  const listItems = document.querySelectorAll(".list-group-item");

  listItems.forEach((listItem) => {
    const text = listItem.textContent.toLowerCase();

    if (text.indexOf(filterValue) === -1) {
      listItem.setAttribute("style", "display: none !important");
    } else {
      listItem.setAttribute("style", "display:block");
    }
  });
};
const deleteTodo = e => {
  if (e.target.parentElement.className === "deleteButton") {
    e.target.parentElement.parentElement.remove();
    deleteTodoFromStorage(
      e.target.parentElement.parentElement.textContent.trim()
    );
    showAlert("success", "Todo removed from list!");
    checkEmpty();
  }
};
const deleteTodoFromStorage = (deleteTodo) => {
  let todos = getTodosFromStorage();

  todos.forEach((todo, index) => {
    if (todo.trim() === deleteTodo) {
      todos.splice(index, 1);
    }
    localStorage.setItem("todos", JSON.stringify(todos));
  });
};
const clearAllTodos = () => {
  while (list.firstElementChild != null) {
    list.removeChild(list.firstElementChild);
  }
  localStorage.removeItem("todos");
  showAlert("success", "All to-dos cleared");
  checkEmpty();
};
const checkEmpty = () => {
  if (localStorage.getItem("todos") === null) {
    emptyText.className = "d-block";
  } else if (localStorage.getItem("todos") === "[]") {
    emptyText.className = "d-block";
  } else {
    emptyText.className = "d-none";
  }
};
const showAlert = (type, message) => {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} role="alert mt-2 mb-0`;
  alert.textContent = message;
  firstCardBody.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 1000);
};

eventListeners();

"use strict";

const TODO_ITEM = "todo-item"; // item container
const TODO_TASK = "todo-task"; // task text
const TODO_DATE = "todo-date"; // task date
const TODO_DATE_SPAN = "todo-date-span"; // task date span

let draggedItem = null; // Drag and drop captured item

const todoInput = document.querySelector(".todo-input");
const todoAddButton = document.querySelector(".todo-add-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const todoToggleDateButton = document.querySelector(".todo-toggle-date");
const todoInputDate = document.querySelector(`.${TODO_DATE}`); // Input date
const userName = document.querySelector(".user-name");

document.addEventListener("DOMContentLoaded", getLocalTodos);
todoAddButton.addEventListener("click", addTodoItem);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);
todoToggleDateButton.addEventListener("click", toggleDateVisibility); // Toggle date functionality

function addTodoItem(event) {
    event.preventDefault(); // don't reload page
    
    // Check if the input is empty
    if (!todoInput.value.trim()) {
        alert("Please enter a task.");
        return;
    }

    createNewItem(todoInput.value, todoInputDate.value, false);

    //ADDING TO LOCAL STORAGE 
    saveLocalTodos(todoInput.value, todoInputDate.value);
    todoInput.value = "";
    todoInputDate.value = "";
}

function deleteCheck(event) {
    const button = event.target;

    if(button.classList[0] === "trash-btn") {
        if (confirm("Are you sure you want to delete this task?")) {
            const todo = button.parentElement;
            todo.classList.add("slide");

            removeLocalTodos(todo);
            todo.addEventListener("transitionend", function() {
                todo.remove();
            });
        }
    }

    if(button.classList[0] === "complete-btn") {
        const todo = button.parentElement;
        todo.classList.toggle("completed");

        updateLocalTodos(todo);

        if (todo.classList.contains("completed")) {
            alert("Congratulations on finishing a task!");
        }
    }
}

function filterTodo(e) {
    const select = todoList.childNodes;
    select.forEach(function(todo) {
        switch(e.target.value) {
            case "all": 
                todo.style.display = "flex";
                break;
            case "completed": 
                if(todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                if(!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });

    localStorage.setItem("filterOption", e.target.value); // Save current filter option in local storage
}

function createNewItem(todoText, todoDate, completed){
    let todoItemDiv = document.createElement("div"); // create item container
    todoItemDiv.classList.add(TODO_ITEM);

    const todoTaskLi = document.createElement("li"); // create task text
    todoTaskLi.classList.add(TODO_TASK);

    const todoTextDiv = document.createElement("div");
    todoTextDiv.innerText = todoText;
    todoTextDiv.classList.add("todo-text");

    const todoDateDiv = document.createElement("div");
    todoDateDiv.innerText = todoDate ? formatDateSlashed(todoDate) : "";;
    todoDateDiv.classList.add(TODO_DATE_SPAN);

    if (localStorage.getItem("dateHidden") === "true") {
        todoDateDiv.classList.add("date-hidden");
    }

    todoTaskLi.appendChild(todoTextDiv);
    todoTaskLi.appendChild(todoDateDiv);

    todoItemDiv.appendChild(todoTaskLi);
    
    if (completed) {
        todoItemDiv.classList.add("completed");
    }
    
    todoItemDiv.appendChild(createCheckButton());
    todoItemDiv.appendChild(createTrashButton());
    
    // Activate drag and drop functionality
    todoItemDiv.setAttribute("draggable", "true");
    
    // Add drag and drop event listeners
    todoItemDiv.addEventListener("dragstart", dragStart);
    todoItemDiv.addEventListener("dragover", dragOver);
    todoItemDiv.addEventListener("drop", drop);
    
    todoList.appendChild(todoItemDiv);
}

function createCheckButton() {
    const checkButton = document.createElement("button");
    checkButton.innerHTML = '<i class="check"></li>';
    checkButton.classList.add("complete-btn");

    return checkButton;
}

function createTrashButton() {
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="trash"></li>';
    trashButton.classList.add("trash-btn");

    return trashButton;
}

function dragStart(e) {
    if (e.target.classList.contains(TODO_ITEM)) {
        draggedItem = e.target;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.target.innerHTML);
    }
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    const toDrop = e.target.parentElement.parentElement;

    if (toDrop.classList.contains(TODO_ITEM) && draggedItem !== null && toDrop !== draggedItem) {
        const tempData = getTodoData(draggedItem);
        updateTodoData(draggedItem, getTodoData(toDrop));
        updateTodoData(toDrop, tempData);

        // Update local storage order
        updateLocalStorageOrder(draggedItem, toDrop);

        // Reset draggedItem
        draggedItem = null;
    }
}

function getTodoData(todoItem) {
    let [text, date] = getDateAndTime(todoItem.querySelector(`.${TODO_TASK}`));
    const completed = todoItem.classList.contains("completed");
    return { text: text, date: date, completed: completed };
}

function getDateAndTime(task) {
    const text = task.querySelector(`.todo-text`).innerText;
    let date = task.querySelector(`.${TODO_DATE_SPAN}`).innerText;

    date = formatDateLined(date);
    if(date.includes("NaN") || date.includes("undefined")) {
        date = "";
    }

    return [text, date];
}

function updateTodoData(todoItem, data) {
    let date = formatDateSlashed(data.date);
    if(date.includes("NaN")) {
        date = "";
    }
    todoItem.querySelector(`.${TODO_TASK}`).querySelector(`.todo-text`).innerText = data.text;
    todoItem.querySelector(`.${TODO_TASK}`).querySelector(`.${TODO_DATE_SPAN}`).innerText = date;

    if (data.completed) {
        todoItem.classList.add("completed");
    } else {
        todoItem.classList.remove("completed");
    }

    // Update local storage
    updateLocalTodos(todoItem);
}

function toggleDateVisibility() {
    const dateElements = document.querySelectorAll(`.${TODO_DATE_SPAN}`);
    dateElements.forEach(function (element) {
        element.classList.toggle("date-hidden");
    });

    // Store current visibility state in localStorage
    localStorage.setItem("dateHidden", dateElements[0]?.classList.contains("date-hidden") || "false");
}

function formatDateSlashed(date) {
    const formattedDate = new Date(date);
    return formattedDate.getDate().toString().padStart(2, "0") + "/"
        + (formattedDate.getMonth() + 1).toString().padStart(2, "0") + "/"
        + formattedDate.getFullYear();
}

function formatDateLined(dateStr){
    const [day, month, year] = dateStr.split("/");
    const date = `${year}-${month}-${day}`;
    
    return date;
}

function saveLocalTodos(todo, date) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push({ text: todo, date: date, completed: false });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(function(todo) {
        createNewItem(todo.text, todo.date, todo.completed);
    });

    const filterOptionValue = localStorage.getItem("filterOption"); // Get current filter option from local storage
    if(filterOptionValue !== null) {
        filterOption.value = filterOptionValue; // Apply current filter option
        filterTodo({ target: filterOption }); // Filter todos based on current filter option
    }
}

function updateLocalTodos(todo) {
    let todos;
    if(localStorage.getItem("todos") === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem("todos"));
    }
  
    const todoIndex = getTodoIndex(todo);
    todos[todoIndex].completed = todo.classList.contains("completed");
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodoIndex(todo) {
    const todoText = todo.querySelector(`.${TODO_TASK}`);
    let [text, date] = getDateAndTime(todoText);

    let todos = JSON.parse(localStorage.getItem("todos"));
    return todos.findIndex(function(item) {
      return item.text === text && item.date === date;
    });
}

function removeLocalTodos(todo) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    const todoIndex = todo.querySelector(`.${TODO_TASK}`).innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function updateLocalStorageOrder(draggedItem, toDrop) {
    let todos = JSON.parse(localStorage.getItem("todos"));

    const draggedItemIndex = getTodoIndex(draggedItem);
    const toDropIndex = getTodoIndex(toDrop);

    const tempTodo = todos[draggedItemIndex];
    todos[draggedItemIndex] = todos[toDropIndex];
    todos[toDropIndex] = tempTodo;

    localStorage.setItem("todos", JSON.stringify(todos));
}

document.querySelector(".todo-sort-date").addEventListener("click", () => {
    let todos = Array.from(document.querySelectorAll(`.${TODO_ITEM}`));
    todos.sort((a, b) => {
        const dateA = a.querySelector(`.${TODO_DATE_SPAN}`).innerText;
        const dateB = b.querySelector(`.${TODO_DATE_SPAN}`).innerText;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return new Date(dateA.split("/").reverse().join("-")) - new Date(dateB.split("/").reverse().join("-"));
    });

    todos.forEach((todo) => {
        todoList.appendChild(todo);
    });

    // Save sorted order to local storage
    let sortedTodos = todos.map(todo => getTodoData(todo));
    localStorage.setItem("todos", JSON.stringify(sortedTodos));
});

document.addEventListener("DOMContentLoaded", () => {
  const savedName = localStorage.getItem("name");
  if (savedName) {
    userName.textContent = `${savedName}'s`;
  } else {
    const inputName = prompt("Welcome! Please enter your name:");
    if (inputName) {
      userName.textContent = `${inputName}'s`;
      localStorage.setItem("name", inputName);
    }
  }
});
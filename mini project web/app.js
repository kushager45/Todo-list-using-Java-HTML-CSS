const input = document.getElementById("todoInput");
const addBtn = document.getElementById("addTodoBtn");
const list = document.getElementById("todoList");
const itemsLeft = document.getElementById("itemsLeft");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterBtns = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

// 🔹 Add Todo
addBtn.addEventListener("click", addTodo);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
});

function addTodo() {
    const text = input.value.trim();
    if (text === "") return;

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(todo);
    input.value = "";
    saveAndRender();
}

// 🔹 Render Todos
function renderTodos(filter = "all") {
    list.innerHTML = "";

    let filteredTodos = todos;

    if (filter === "active") {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (filter === "completed") {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement("li");
        li.className = `todo-item ${todo.completed ? "completed" : ""}`;

        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? "checked" : ""}>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn">×</button>
        `;

        // Toggle Complete
        li.querySelector(".todo-checkbox").addEventListener("change", () => {
            todo.completed = !todo.completed;
            saveAndRender();
        });

        // Delete
        li.querySelector(".delete-btn").addEventListener("click", () => {
            todos = todos.filter(t => t.id !== todo.id);
            saveAndRender();
        });

        list.appendChild(li);
    });

    updateCount();
}

// 🔹 Update Count
function updateCount() {
    const active = todos.filter(todo => !todo.completed).length;
    itemsLeft.textContent = `${active} items left`;
}

// 🔹 Clear Completed
clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter(todo => !todo.completed);
    saveAndRender();
});

// 🔹 Filters
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filter-btn.active").classList.remove("active");
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");
        renderTodos(filter);
    });
});

// 🔹 Save + Render
function saveAndRender() {
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos(document.querySelector(".filter-btn.active").dataset.filter);
}

// 🔹 Initial Load
renderTodos();
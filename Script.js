const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");

const clearBtn = document.getElementById("clearBtn");
const dateElement = document.getElementById("date");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


/* Show today's date */

const today = new Date();

dateElement.textContent = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
});


/* Add task */

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}


/* Display tasks */

function renderTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    tasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className = "task";

        if (task.completed) {
            taskElement.classList.add("completed");
        }

        taskElement.innerHTML = `
            <input 
                type="checkbox" 
                class="task-check"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-text">${escapeHTML(task.text)}</span>

            <button class="delete-btn">🗑</button>
        `;


        /* Complete task */

        const checkbox = taskElement.querySelector(".task-check");

        checkbox.addEventListener("change", () => {

            task.completed = checkbox.checked;

            saveTasks();
            renderTasks();

        });


        /* Delete task */

        const deleteBtn = taskElement.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", () => {

            tasks = tasks.filter(item => item.id !== task.id);

            saveTasks();
            renderTasks();

        });


        taskList.appendChild(taskElement);

    });


    updateStats();
}


/* Statistics */

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const remaining = total - completed;

    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    remainingTasks.textContent = remaining;
}


/* Clear completed tasks */

clearBtn.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();

});


/* Add task button */

addBtn.addEventListener("click", addTask);


/* Enter key */

taskInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        addTask();
    }

});


/* Save data */

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


/* Basic HTML protection */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* First load */

renderTasks();

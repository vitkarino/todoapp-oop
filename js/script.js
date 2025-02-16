class TodoApp {
  constructor() {
    this.tasks = [];
    this.taskList = document.querySelector(".todo-list");
  }

  addTask(taskText) {
    if (taskText == "" || taskText == null) {
        alert("Task cannot be empty!")
    }

    const newTask = new Task(taskText);
    this.tasks.push(newTask);
    this.render();
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.render();
  }

  render() {
    this.taskList.innerHTML = "";

    this.tasks.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("todo-list__item");
        taskItem.innerHTML = `
            <button class="todo-list__checkbox">
                <img class="checkbox__icon" src="src/material-symbols--done-rounded (1).svg" alt="">
            </button>
            <span class="todo-list__text">${task.taskText}</span>
            <button class="todo-list__delete" data-id="${task.id}">
                <img src="src/material-symbols--delete (1).svg" alt="">
            </button>
        `;

        taskItem.querySelector(".todo-list__delete").addEventListener("click", () => {
            this.removeTask(task.id);
        });

        this.taskList.appendChild(taskItem);
    });
  }
}
class Task {
  constructor(taskText) {
    this.id = Math.random().toString(16).slice(2);
    this.taskText = taskText;
    this.completed = false;
  }
}

const todo = new TodoApp();

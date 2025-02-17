class TodoApp {
  constructor() {
    this.$ = (selector) => document.querySelector(selector);
    this.$$ = (selector) => document.querySelectorAll(selector);

    this.tasks = LocalStorage.get("tasks") || [];
    this.taskList = this.$(".todo-app__list");
    this.taskTemplate = this.$("#todo-app__task-template");

    this.$(".todo-app__form").addEventListener("submit", (event) => {
      event.preventDefault();
      const taskInput = this.$(".todo-app__task-input");
      const taskText = taskInput.value.trim();
      if (taskText) {
        this.addTask(taskText);
        taskInput.value = "";
      }
    });

    this.render();
  }

  addTask(taskText) {
    if (!taskText) {
      alert("Task cannot be empty!");
      return;
    }

    const newTask = new Task(taskText);
    this.tasks.push(newTask);
    LocalStorage.set("tasks", this.tasks);
    this.render();
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    LocalStorage.set("tasks", this.tasks);
    this.render();
  }

  toggleTaskCompletion(taskId) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      task.completed = !task.completed;
      LocalStorage.set("tasks", this.tasks);
      this.render();
    }
  }

  render() {
    while (this.taskList.firstChild) {
      this.taskList.removeChild(this.taskList.firstChild);
    }

    this.tasks.forEach((task) => {
      const taskItem = document.importNode(this.taskTemplate.content, true);
      taskItem.querySelector(".todo-app__text").textContent = task.taskText;

      const deleteButton = taskItem.querySelector(".todo-app__button--delete");
      deleteButton.dataset.id = task.id;
      deleteButton.addEventListener("click", () => this.removeTask(task.id));

      const completeButton = taskItem.querySelector(".todo-app__button--checkbox");
      completeButton.dataset.id = task.id;
      completeButton.addEventListener("click", () => this.toggleTaskCompletion(task.id));

      if (task.completed) {
        taskItem.querySelector(".todo-app__text").classList.add("completed");
      }

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

class LocalStorage {
  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
}

const todo = new TodoApp();

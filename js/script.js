class TodoApp {
  constructor() {
    this.$ = (selector) => document.querySelector(selector);

    this.tasks = LocalStorage.get("tasks") || [];
    this.taskList = this.$(".todo-app__task-list");
    this.taskTemplate = this.$("#task-template");

    this.$(".todo-app__form").addEventListener("submit", (event) => {
      event.preventDefault();
      const taskInput = this.$(".todo-app__input");
      const taskText = taskInput.value.trim();
      if (taskText) {
        this.addTask(taskText);
        taskInput.value = "";
      }
    });

    this.render();
  }

  addTask(taskText) {
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
      const taskElement = taskItem.querySelector(".todo-app__task");
      const taskText = taskItem.querySelector(".todo-app__text");
      const deleteButton = taskItem.querySelector(".todo-app__button--delete");
      const completeButton = taskItem.querySelector(
        ".todo-app__button--checkbox"
      );

      taskText.textContent = task.taskText;
      taskElement.dataset.id = task.id;
      taskElement.dataset.completed = task.completed;

      deleteButton.dataset.id = task.id;
      deleteButton.addEventListener("click", () => this.removeTask(task.id));

      completeButton.dataset.id = task.id;
      completeButton.addEventListener("click", () =>
        this.toggleTaskCompletion(task.id)
      );

      this.taskList.appendChild(taskItem);
    });
  }
}

class Task {
  constructor(taskText) {
    this.id = crypto.randomUUID();
    this.taskText = taskText;
    this.completed = false;
  }
}

class LocalStorage {
  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      return [];
    }
  }
}

const todo = new TodoApp();

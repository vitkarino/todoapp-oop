$ = (selector) => document.querySelector(selector);
class TodoApp {
  constructor(sSelector) {
      this.UI = $(sSelector);
      this.find = (selector) => this.UI.querySelector(selector);
      this.tasks = LocalStorage.get("tasks") || [];
      this.taskList = this.find(".app__task-list");
      this.taskTemplate = this.find("#task-template");

      this.find(".header__form").addEventListener("submit", (event) => {
          event.preventDefault();
          const eTaskInput = this.find(".form__input");
          const sTaskText = eTaskInput.value.trim();
          if (sTaskText) {
              this.addTask(sTaskText);
              eTaskInput.value = "";
          }
      });

      this.renderTasks();
  }

  addTask(taskText) {
      const newTask = new Task(taskText);
      this.tasks.push(newTask);
      LocalStorage.set("tasks", this.tasks);

      this.renderTask(newTask);
  }

  removeTask(taskId) {
      this.tasks = this.tasks.filter((task) => task.id !== parseInt(taskId, 10));
      LocalStorage.set("tasks", this.tasks);

      const taskElement = this.taskList.querySelector(
          `.task[data-id="${taskId}"]`
      );
      if (taskElement) taskElement.remove();
  }

  toggleTaskCompletion(taskId) {
      const task = this.tasks.find((task) => task.id === parseInt(taskId, 10));
      if (task) {
          task.completed = !task.completed;
          LocalStorage.set("tasks", this.tasks);

          const taskElement = this.taskList.querySelector(
              `.task[data-id="${taskId}"]`
          );
          if (taskElement) taskElement.dataset.completed = task.completed;
      }
  }

  renderTask(oTask) {
      const taskItem = document.importNode(this.taskTemplate.content, true);
      const taskElement = taskItem.querySelector(".task");
      const taskTextElement = taskItem.querySelector(".c-checkbox__text"); 
      const deleteButton = taskItem.querySelector(".button_delete");
      const checkboxInput = taskItem.querySelector(".c-checkbox__chk"); 

      taskTextElement.textContent = oTask.taskText;
      taskElement.dataset.id = oTask.id;
      taskElement.dataset.completed = oTask.completed;

      deleteButton.addEventListener("click", () => this.removeTask(oTask.id));
      checkboxInput.addEventListener("change", () => 
          this.toggleTaskCompletion(oTask.id)
      );

      this.taskList.appendChild(taskItem);
  }

  renderTasks() {
      while (this.taskList.firstChild) {
          this.taskList.removeChild(this.taskList.firstChild);
      }
      this.tasks.forEach((task) => this.renderTask(task));
  }
}

class Task {
  static idCounter = 0;
  constructor(taskText) {
      this.id = ++Task.idCounter;
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
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
      } catch (error) {
          throw new Error(`Error getting item from localStorage: ${error}`);
      }
  }
}

const todo = new TodoApp("#todoapp1");

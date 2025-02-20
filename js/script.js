$ = (selector) => document.querySelector(selector);

class TodoApp {
  constructor(sSelector) {
    this.UI = $(sSelector);
    this.find = (selector) => this.UI.querySelector(selector);
    this.tasks = LocalStorage.get("tasks") || [];
    this.taskList = this.find(".main__task-list");
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
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    LocalStorage.set("tasks", this.tasks);

    const taskElement = this.taskList.querySelector(`[data-id="${taskId}"]`);
    if (taskElement) taskElement.remove();
  }

  toggleTaskCompletion(taskId) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      task.completed = !task.completed;
      LocalStorage.set("tasks", this.tasks);
    }

    const taskElement = this.taskList.querySelector(`[data-id="${taskId}"]`);
    if (taskElement) taskElement.dataset.completed = task.completed;
  }

  renderTask(oTask) {
    const taskItem = document.importNode(this.taskTemplate.content, true);
    const taskElement = taskItem.querySelector(".task");
    const taskText = taskItem.querySelector(".task__text");
    const deleteButton = taskItem.querySelector(".button--delete");
    const completeButton = taskItem.querySelector(".button--checkbox");

    taskText.textContent = oTask.taskText;
    taskElement.dataset.id = oTask.id;
    taskElement.dataset.completed = oTask.completed;

    deleteButton.dataset.id = oTask.id;
    deleteButton.addEventListener("click", () => this.removeTask(oTask.id));

    completeButton.dataset.id = oTask.id;
    completeButton.addEventListener("click", () =>
      this.toggleTaskCompletion(oTask.id)
    );

    this.taskList.appendChild(taskItem);
  }

  renderTasks() {
    while (this.taskList.firstChild) {
      // Цей цикл видаляє всі дочірні елементи taskList
      this.taskList.removeChild(this.taskList.firstChild);
      // Видаляє перший дочірній елемент на кожній ітерації

      // Альтернативний метод - this.taskList.innerHTML = ""; Проте є менш безпечним через можливість XSS атак та загалом не рекомендується використовувати його де є взаємодія DOM та БД.
      // Також можна обрати цикл for, у разі потрібності контролю індексів, проте в нашому випадку це не обовʼязково.
    }

    this.tasks.forEach((task) => this.renderTask(task));
  }
}

class Task {
  constructor(taskText) {
    this.id = crypto.randomUUID();
    // Я вирішив використати саме цей метод, оскільки немає БД, з якого можна було б витягнути унікальний ідентифікатор.

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

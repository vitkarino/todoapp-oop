$ = (selector) => document.querySelector(selector);

class TodoApp {
  constructor(sSelector) {
    this.UI = $(sSelector);
    this.find = (selector) => this.UI.querySelector(selector);
    this.tasks = LocalStorage.get("tasks") || [];
    this.taskList = this.find(".app__task-list");
    this.taskTemplate = this.find("#task-template");

    this.taskList.addEventListener("click", (event) => this.handleClick(event));

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

  handleClick(event) {
    const taskElement = event.target.closest(".task");
    if (!taskElement) return;

    const taskId = taskElement.dataset.id;

    if (event.target.closest(".button_delete")) {
      this.removeTask(taskId);
    } else if (event.target.closest(".button_checkbox")) {
      this.toggleTaskCompletion(taskId);
    }
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
    }

    const taskElement = this.taskList.querySelector(
      `.task[data-id="${taskId}"]`
    );
    if (taskElement) taskElement.dataset.completed = task.completed;
  }

  renderTask(oTask) {
    const taskItem = document.importNode(this.taskTemplate.content, true);
    const taskElement = taskItem.querySelector(".task");
    const taskText = taskItem.querySelector(".task__text");

    taskText.textContent = oTask.taskText;
    taskElement.dataset.id = oTask.id;
    taskElement.dataset.completed = oTask.completed;

    this.taskList.appendChild(taskItem);
  }

  renderTasks() {
    while (this.taskList.firstChild) {
      // Контроль індексів можна і через while зробити, але використання for буде більш читаємим.

      // Також іншою критерією вибору є те, що ми не знаємо скільки саме треба видалити елементів.
      
      // Альтернативами є цикли for (в нашому випадку не підходить, бо не відома кількість елем ентів), for...of (не підходить, бо можуть бути проблеми з пропусками елементів), for...in (не підходить, так як він використовується для роботи з обʼєктами а не масивами), forEach (аналогічно з for...of)
      
      this.taskList.removeChild(this.taskList.firstChild);
      // Альтернативний метод - this.taskList.innerHTML = ""; Проте є менш безпечним через можливість XSS атак та загалом не рекомендується використовувати його де є взаємодія DOM та БД. Також альтернативні методи: textContent = "" (не варіант, бо видаляє тільки текст, хоча дочірні елементи залишаться), innerText = "" (аналогічно, видаляє тільки текст, але не дочірні елементи), replaceChildren() (доволі ефективний метод, але не підтримується в деяких браузерах);
      
      // Якщо не враховувати безпеку та XSS атаки, то також слід уважно обирати такі методи, щоб вони максимально підтримувалися усіма можливими браузерами а також мали максимальну швидкість.
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

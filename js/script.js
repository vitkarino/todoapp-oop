class Task {
    constructor(text, deadline, completed = false) {
        this.id = Math.random().toString(16).slice(11);
        this.text = text;
        this.deadline = deadline;
        this.completed = completed;
    }
}

class TodoApp {
    constructor() {
        this.tasks = [];
    }

    addTask(text, deadline) {
        const newTask = new Task(text, deadline);
        this.tasks.push(newTask);
        console.log(newTask);
    }
}

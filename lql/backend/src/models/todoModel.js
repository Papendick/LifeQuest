/*
 * Modell für Tages-ToDos.  Speichert Aufgaben pro Benutzer und Tag.
 */

class TodoModel {
  constructor() {
    this.todos = [];
    this.nextTodoId = 1;
    this.points = new Map(); // Punktestand pro userId
  }

  /**
   * Erstellt ein neues ToDo.  Prüft Limits: max. 5 normale ToDos pro Tag und
   * max. 10 Best‑Case-ToDos pro Tag.
   */
  createTodo(data) {
    const { userId, date, type } = data;
    const dayTodos = this.todos.filter((t) => t.userId === userId && t.date === date && t.type === type);
    const limit = type === 'best' ? 10 : 5;
    if (dayTodos.length >= limit) {
      return null;
    }
    const todo = {
      id: this.nextTodoId++,
      userId,
      date, // ISO String YYYY-MM-DD
      title: data.title,
      description: data.description,
      difficulty: data.difficulty, // 'leicht', 'mittel', 'schwer'
      type, // 'normal' oder 'best'
      status: 'offen', // 'offen', 'erledigt', 'nicht_erledigt'
    };
    this.todos.push(todo);
    return todo;
  }

  getTodosForDate(userId, date) {
    return this.todos.filter((t) => t.userId === userId && t.date === date);
  }

  findById(id) {
    return this.todos.find((t) => t.id === id);
  }

  updateTodo(id, data) {
    const todo = this.findById(id);
    if (!todo) return null;
    Object.assign(todo, data);
    return todo;
  }

  deleteTodo(id) {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.todos.splice(index, 1);
    return true;
  }

  /**
   * Vergibt Punkte beim Statuswechsel.  Wenn ein ToDo erledigt wird, erhält der
   * Nutzer je nach Schwierigkeit Punkte (1, 2, 5).  Wenn ein normales ToDo
   * nicht erledigt wird, wird 1 Punkt abgezogen.  Best‑Case‑ToDos geben keine
   * Strafe bei Nichterledigung.
   */
  finalizeTodoStatus(id, status) {
    const todo = this.findById(id);
    if (!todo) return null;
    todo.status = status;
    const { userId, difficulty, type } = todo;
    let delta = 0;
    if (status === 'erledigt') {
      delta = difficulty === 'leicht' ? 1 : difficulty === 'mittel' ? 2 : 5;
    } else if (status === 'nicht_erledigt' && type === 'normal') {
      delta = -1;
    }
    const current = this.points.get(userId) || 0;
    this.points.set(userId, Math.max(0, current + delta));
    return { todo, points: this.points.get(userId) };
  }

  /**
   * Holt den Punktestand eines Nutzers.
   */
  getPoints(userId) {
    return this.points.get(userId) || 0;
  }
}

export default new TodoModel();
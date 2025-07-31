/*
 * Controller für das ToDo-Modul.  Stellt CRUD‑Operationen und
 * Punktelogik zur Verfügung.
 */
import todoModel from '../models/todoModel.js';

function getUserId(req) {
  return req.userId || (req.body && req.body.userId) || 1;
}

export function createTodo(req, res) {
  const userId = getUserId(req);
  const { title, description, difficulty, type, date } = req.body;
  if (!title || !difficulty || !type || !date) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Titel, Schwierigkeit, Typ und Datum sind erforderlich.' }));
  }
  const todo = todoModel.createTodo({ userId, title, description, difficulty, type, date });
  if (!todo) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Limit an ToDos für diesen Tag erreicht.' }));
  }
  res.writeHead(201, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(todo));
}

export function listTodos(req, res, date) {
  const userId = getUserId(req);
  const todos = todoModel.getTodosForDate(userId, date);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(todos));
}

export function updateTodo(req, res, id) {
  const updated = todoModel.updateTodo(id, req.body);
  if (!updated) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'ToDo nicht gefunden.' }));
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(updated));
}

export function deleteTodo(req, res, id) {
  const success = todoModel.deleteTodo(id);
  if (!success) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'ToDo nicht gefunden.' }));
  }
  res.writeHead(204);
  return res.end();
}

export function finalizeTodo(req, res, id) {
  const { status } = req.body;
  if (!['erledigt', 'nicht_erledigt'].includes(status)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Ungültiger Status.' }));
  }
  const result = todoModel.finalizeTodoStatus(id, status);
  if (!result) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'ToDo nicht gefunden.' }));
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(result));
}

export function getPoints(req, res) {
  const userId = getUserId(req);
  const points = todoModel.getPoints(userId);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify({ points }));
}
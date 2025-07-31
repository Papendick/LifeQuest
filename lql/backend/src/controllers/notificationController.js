/*
 * Controller für Benachrichtigungen.  Hier werden Erinnerungen erstellt
 * und gelistet.  Die Implementierung löst noch keine realen
 * Benachrichtigungen aus.
 */
import notificationModel from '../models/notificationModel.js';

function getUserId(req) {
  return req.userId || (req.body && req.body.userId) || 1;
}

export function createNotification(req, res) {
  const userId = getUserId(req);
  const { type, time, payload } = req.body;
  if (!type || !time) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Typ und Uhrzeit sind erforderlich.' }));
  }
  const notif = notificationModel.createNotification(userId, type, time, payload);
  res.writeHead(201, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(notif));
}

export function listNotifications(req, res) {
  const userId = getUserId(req);
  const list = notificationModel.listNotifications(userId);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(list));
}
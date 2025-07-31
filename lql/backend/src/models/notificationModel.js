/*
 * Modell für Benachrichtigungen und Erinnerungen.  Speichert pro Benutzer
 * geplante Erinnerungen.  Diese Implementierung löst keine echten
 * Benachrichtigungen aus; sie dient als Datenbasis für zukünftige
 * Scheduling‑Mechanismen.
 */

class NotificationModel {
  constructor() {
    this.notifications = [];
    this.nextId = 1;
  }

  createNotification(userId, type, time, payload) {
    const notification = {
      id: this.nextId++,
      userId,
      type, // z. B. 'diary' oder 'deadline'
      time, // ISO‑Zeit oder 'HH:MM'
      payload: payload || {},
      createdAt: new Date().toISOString(),
    };
    this.notifications.push(notification);
    return notification;
  }

  listNotifications(userId) {
    return this.notifications.filter((n) => n.userId === userId);
  }
}

export default new NotificationModel();
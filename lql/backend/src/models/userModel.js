/*
 * Ein einfaches User-Modell auf Basis eines Arrays.  In einer echten Anwendung
 * sollte hier eine Datenbank verwendet werden.  Dieses Modell dient nur zur
 * Demonstration der Authentifizierung und als Ausgangspunkt für die weitere
 * Entwicklung.
 */
import bcrypt from "bcryptjs";

class UserModel {
  constructor() {
    this.users = []; // In‑Memory‑Speicher für Benutzer
  }

  /**
   * Fügt einen neuen Benutzer hinzu.
   * @param {string} username
   * @param {string} password Klartextpasswort
   * @returns {object} neu erstellter Benutzer oder null, wenn der Nutzername bereits existiert
   */
  async createUser(username, password) {
    const existing = this.users.find((u) => u.username === username);
    if (existing) return null;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = { id: this.users.length + 1, username, password: hashed };
    this.users.push(user);
    return { id: user.id, username: user.username };
  }

  /**
   * Sucht einen Benutzer anhand des Nutzernamens.
   * @param {string} username
   */
  findByUsername(username) {
    return this.users.find((u) => u.username === username);
  }
}

export default new UserModel();
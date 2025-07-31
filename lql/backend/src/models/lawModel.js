/*
 * Modell für persönliche Gesetze (Regeln).  Speichert pro Benutzer eine
 * dynamische Liste von Regeln.  Jede Regel hat eine frei definierte
 * Strafpunktzahl.
 */

class LawModel {
  constructor() {
    this.laws = [];
    this.nextId = 1;
  }

  /**
   * Fügt mehrere Gesetze gleichzeitig hinzu.  Es können nur 10–50
   * Einträge pro Aufruf erstellt werden.  Jeder Eintrag muss einen
   * Titel, einen Prompt (Textanweisung) und eine Strafpunktzahl enthalten.
   * @param {number} userId
   * @param {Array<object>} items
   */
  createBatch(userId, items) {
    if (!Array.isArray(items) || items.length < 1) return null;
    if (items.length < 10 || items.length > 50) return null;
    const created = [];
    for (const item of items) {
      const { title, prompt, penaltyPoints } = item;
      if (!title || !prompt || typeof penaltyPoints !== 'number') {
        continue;
      }
      const law = {
        id: this.nextId++,
        userId,
        title,
        prompt,
        penaltyPoints,
        createdAt: new Date().toISOString(),
        active: true,
      };
      this.laws.push(law);
      created.push(law);
    }
    return created;
  }

  listLaws(userId) {
    return this.laws.filter((l) => l.userId === userId);
  }
}

export default new LawModel();
/*
 * Modell für Tagebuch‑Einträge.  Speichert Einträge mit Original‑ und
 * bearbeitetem Inhalt, Tags und Strafpunkten.  Für den Prototyp werden
 * Einträge in einem Array gespeichert.
 */

class DiaryModel {
  constructor() {
    this.entries = [];
    this.nextId = 1;
  }

  createEntry(data) {
    const entry = {
      id: this.nextId++,
      userId: data.userId,
      date: data.date, // ISO Datum
      content: data.content,
      improvedContent: data.improvedContent || null,
      tags: data.tags || [],
      penalties: data.penalties || 0,
      points: data.points || 0,
      createdAt: new Date().toISOString(),
    };
    this.entries.push(entry);
    return entry;
  }

  listEntries(userId) {
    return this.entries.filter((e) => e.userId === userId);
  }

  findByDate(userId, date) {
    return this.entries.filter((e) => e.userId === userId && e.date === date);
  }
}

export default new DiaryModel();
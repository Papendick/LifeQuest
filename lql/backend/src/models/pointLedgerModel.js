/*
 * Punktelogbuch.  Protokolliert alle Punktezuteilungen und -abzüge für
 * einen Benutzer.  In einem realen System sollten diese Daten in einer
 * Datenbank persistiert werden.
 */

class PointLedgerModel {
  constructor() {
    this.ledger = [];
  }

  addEntry(userId, amount, reason) {
    const entry = {
      id: this.ledger.length + 1,
      userId,
      amount, // positive oder negative Punkte
      reason,
      date: new Date().toISOString(),
    };
    this.ledger.push(entry);
    return entry;
  }

  listEntries(userId) {
    return this.ledger.filter((e) => e.userId === userId);
  }
}

export default new PointLedgerModel();
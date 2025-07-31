/*
 * Einfaches Quest-Modell mit Unterstützung für Mainquests und Sidequests.
 * Für diese Demo werden alle Quests in einem In‑Memory‑Array gespeichert.
 */

class QuestModel {
  constructor() {
    this.quests = [];
    this.nextQuestId = 1;
    this.nextStageId = 1;
  }

  /**
   * Erstellt eine neue Quest.  Prüft Limits für Mainquests (max. 5) und
   * Sidequests (max. 20) pro Benutzer.  Falls das Limit überschritten wird,
   * wird null zurückgegeben.
   * @param {object} data
   * @returns {object|null}
   */
  createQuest(data) {
    const { userId, type } = data;
    // Zähle Quests des Nutzers nach Typ
    const userQuests = this.quests.filter((q) => q.userId === userId && q.type === type);
    const limit = type === 'main' ? 5 : 20;
    if (userQuests.length >= limit) {
      return null;
    }
    const quest = {
      id: this.nextQuestId++,
      userId,
      type, // 'main' oder 'side'
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      rewardId: data.rewardId || null,
      stages: [],
    };
    this.quests.push(quest);
    return quest;
  }

  /**
   * Gibt alle Quests eines Benutzers zurück.
   */
  getUserQuests(userId) {
    return this.quests.filter((q) => q.userId === userId);
  }

  /**
   * Findet eine Quest anhand der ID.
   */
  findById(id) {
    return this.quests.find((q) => q.id === id);
  }

  updateQuest(id, data) {
    const quest = this.findById(id);
    if (!quest) return null;
    Object.assign(quest, data);
    return quest;
  }

  deleteQuest(id) {
    const index = this.quests.findIndex((q) => q.id === id);
    if (index === -1) return false;
    this.quests.splice(index, 1);
    return true;
  }

  /**
   * Fügt einer Quest ein Etappenziel hinzu.
   */
  addStage(questId, data) {
    const quest = this.findById(questId);
    if (!quest) return null;
    const stage = {
      id: this.nextStageId++,
      questId,
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      rewardId: data.rewardId || null,
      completed: false,
    };
    quest.stages.push(stage);
    return stage;
  }

  updateStage(questId, stageId, data) {
    const quest = this.findById(questId);
    if (!quest) return null;
    const stage = quest.stages.find((s) => s.id === stageId);
    if (!stage) return null;
    Object.assign(stage, data);
    return stage;
  }

  deleteStage(questId, stageId) {
    const quest = this.findById(questId);
    if (!quest) return false;
    const index = quest.stages.findIndex((s) => s.id === stageId);
    if (index === -1) return false;
    quest.stages.splice(index, 1);
    return true;
  }

  /**
   * Markiert ein Etappenziel als erledigt.
   */
  completeStage(questId, stageId) {
    const stage = this.updateStage(questId, stageId, { completed: true });
    return stage;
  }

  /**
   * Berechnet den Fortschritt einer Quest in Prozent.
   */
  calculateProgress(quest) {
    if (!quest.stages.length) return 0;
    const done = quest.stages.filter((s) => s.completed).length;
    return Math.round((done / quest.stages.length) * 100);
  }
}

export default new QuestModel();
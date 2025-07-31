/*
 * Modell für Belohnungen.  Speichert pro Benutzer definierte Belohnungen
 * mit erforderlicher Punktzahl, Bild‑URL und optionalem Amazon‑Link.
 */
class RewardModel {
  constructor() {
    this.rewards = [];
    this.nextId = 1;
  }

  createReward(userId, data) {
    const reward = {
      id: this.nextId++,
      userId,
      title: data.title,
      description: data.description || '',
      imageUrl: data.imageUrl || null,
      amazonLink: data.amazonLink || null,
      pointsRequired: data.pointsRequired || 0,
    };
    this.rewards.push(reward);
    return reward;
  }

  listRewards(userId) {
    return this.rewards.filter((r) => r.userId === userId);
  }
}

export default new RewardModel();
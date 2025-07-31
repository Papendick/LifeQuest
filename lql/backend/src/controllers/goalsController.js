/*
 * Controller für die Ziele‑Übersicht (Gantt‑Diagramm).  Verwendet das
 * Quest‑Modell, um alle Main‑Quests eines Benutzers samt Etappenzielen
 * aufzubereiten.  Berechnet den Fortschritt auf Basis der erledigten
 * Etappenziele.
 */
import questModel from '../models/questModel.js';

function getUserId(req) {
  return req.userId || 1;
}

export function listGoals(req, res) {
  const userId = getUserId(req);
  const quests = questModel.getUserQuests(userId).filter((q) => q.type === 'main');
  const goals = quests.map((q) => {
    const totalStages = q.stages.length;
    const completedStages = q.stages.filter((s) => s.completed).length;
    const progress = totalStages === 0 ? 0 : Math.round((completedStages / totalStages) * 100);
    return {
      id: q.id,
      title: q.title,
      start: q.startDate,
      end: q.endDate,
      progress,
      stages: q.stages.map((s) => ({
        id: s.id,
        title: s.title,
        start: s.startDate,
        end: s.endDate,
        completed: s.completed,
      })),
    };
  });
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(goals));
}
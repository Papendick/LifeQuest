/*
 * Minimaler HTTP‑Server zur Bereitstellung einer REST‑API ohne externe Abhängigkeiten.
 * Er liest Konfigurationen aus der .env‑Datei, implementiert eine einfache
 * Benutzerregistrierung und -anmeldung mit JWT‑ähnlichem Token.  Dieses Token
 * dient nur zu Demonstrationszwecken und sollte in einer produktiven
 * Anwendung durch eine echte JWT‑Bibliothek ersetzt werden.
 */
import { createServer } from 'http';
import { parse } from 'url';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import * as questController from './controllers/questController.js';
import * as todoController from './controllers/todoController.js';

// Hilfsfunktion zum Laden der .env-Datei
function loadEnv(envPath) {
  const env = {};
  try {
    const content = readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const [key, ...rest] = trimmed.split('=');
      env[key] = rest.join('=');
    });
  } catch (e) {
    // Datei existiert möglicherweise nicht
  }
  return env;
}

// Lade Umgebungsvariablen
const __dirname = dirname(fileURLToPath(import.meta.url));
const env = loadEnv(resolve(__dirname, '../.env'));
const PORT = env.PORT || 3000;
const JWT_SECRET = env.JWT_SECRET || 'secret';

// In‑Memory‑Benutzerdatenbank
const users = [];

// Hilfsfunktion zur Passwort‑Hashing
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Hilfsfunktion zur Erstellung eines einfachen Tokens
function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64');
  return `${header}.${body}.${signature}`;
}

// Server erstellen
const server = createServer((req, res) => {
  const { pathname } = parse(req.url, true);

  // CORS‑Header (einfach gehalten)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Startseite
  if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'LQL Backend läuft. Ergänze weitere Routen nach Bedarf.' }));
  }

  // Registrierung
  if (pathname === '/api/users/register' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body);
        if (!username || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'Nutzername und Passwort sind erforderlich.' }));
        }
        const exists = users.find((u) => u.username === username);
        if (exists) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'Benutzername existiert bereits.' }));
        }
        const hashed = hashPassword(password);
        const user = { id: users.length + 1, username, password: hashed };
        users.push(user);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Benutzer erstellt.', user: { id: user.id, username: user.username } }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Ungültige Anfrage.' }));
      }
    });
    return;
  }

  // Login
  if (pathname === '/api/users/login' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body);
        const user = users.find((u) => u.username === username);
        if (!user) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'Ungültige Anmeldedaten.' }));
        }
        const hashed = hashPassword(password);
        if (hashed !== user.password) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'Ungültige Anmeldedaten.' }));
        }
        const token = generateToken({ id: user.id, username: user.username });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Login erfolgreich.', token }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Ungültige Anfrage.' }));
      }
    });
    return;
  }

  /*
   * Quest‑Routen.  Pfade:
   * - POST   /api/quests                 -> erstelle Quest
   * - GET    /api/quests                 -> liste Quests des Nutzers
   * - GET    /api/quests/:id             -> zeige einzelne Quest
   * - PUT    /api/quests/:id             -> aktualisiere Quest
   * - DELETE /api/quests/:id             -> lösche Quest
   * - POST   /api/quests/:id/stages      -> erstelle Etappenziel
   * - PUT    /api/quests/:id/stages/:sid -> aktualisiere Etappenziel
   * - DELETE /api/quests/:id/stages/:sid -> lösche Etappenziel
   */
  if (pathname.startsWith('/api/quests')) {
    const segments = pathname.split('/').filter(Boolean); // z.B. ['api','quests','1','stages','2']
    // Hilfsfunktion zum Lesen des JSON-Körpers
    function parseBody(callback) {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          req.body = body ? JSON.parse(body) : {};
        } catch (e) {
          req.body = {};
        }
        callback();
      });
    }
    // /api/quests (ohne ID)
    if (segments.length === 2) {
      if (req.method === 'POST') {
        return parseBody(() => questController.createQuest(req, res));
      }
      if (req.method === 'GET') {
        return questController.listQuests(req, res);
      }
    }
    // /api/quests/:id
    if (segments.length === 3) {
      const questId = parseInt(segments[2]);
      if (Number.isNaN(questId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Ungültige Quest-ID.' }));
      }
      if (req.method === 'GET') {
        return questController.getQuest(req, res, questId);
      }
      if (req.method === 'PUT') {
        return parseBody(() => questController.updateQuest(req, res, questId));
      }
      if (req.method === 'DELETE') {
        return questController.deleteQuest(req, res, questId);
      }
    }
    // /api/quests/:id/stages
    if (segments.length === 4 && segments[3] === 'stages') {
      const questId = parseInt(segments[2]);
      if (Number.isNaN(questId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Ungültige Quest-ID.' }));
      }
      if (req.method === 'POST') {
        return parseBody(() => questController.createStage(req, res, questId));
      }
    }
    // /api/quests/:id/stages/:stageId
    if (segments.length === 5 && segments[3] === 'stages') {
      const questId = parseInt(segments[2]);
      const stageId = parseInt(segments[4]);
      if (Number.isNaN(questId) || Number.isNaN(stageId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Ungültige IDs.' }));
      }
      if (req.method === 'PUT') {
        return parseBody(() => questController.updateStage(req, res, questId, stageId));
      }
      if (req.method === 'DELETE') {
        return questController.deleteStage(req, res, questId, stageId);
      }
    }
    // Nicht unterstützte Quest-Route
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Quest-Route nicht gefunden.' }));
  }

  /*
   * ToDo‑Routen:
   * - POST   /api/todos                    -> erstelle ToDo
   * - GET    /api/todos?date=YYYY-MM-DD    -> liste ToDos des Tages
   * - PUT    /api/todos/:id                -> aktualisiere ToDo
   * - DELETE /api/todos/:id                -> lösche ToDo
   * - POST   /api/todos/:id/finalize       -> markiere als erledigt oder nicht erledigt
   * - GET    /api/todos/points             -> gebe Punktestand zurück
   */
  if (pathname.startsWith('/api/todos')) {
    const segments = pathname.split('/').filter(Boolean);
    function parseBody(callback) {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          req.body = body ? JSON.parse(body) : {};
        } catch (e) {
          req.body = {};
        }
        callback();
      });
    }
    // /api/todos/points
    if (segments.length === 3 && segments[2] === 'points' && req.method === 'GET') {
      return todoController.getPoints(req, res);
    }
    // /api/todos ohne ID
    if (segments.length === 2) {
      if (req.method === 'POST') {
        return parseBody(() => todoController.createTodo(req, res));
      }
      if (req.method === 'GET') {
        const query = parse(req.url, true).query;
        const date = query.date;
        if (!date) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'Datum erforderlich.' }));
        }
        return todoController.listTodos(req, res, date);
      }
    }
    // /api/todos/:id
    if (segments.length >= 3) {
      const id = parseInt(segments[2]);
      if (Number.isNaN(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Ungültige ToDo-ID.' }));
      }
      // finalize
      if (segments.length === 4 && segments[3] === 'finalize' && req.method === 'POST') {
        return parseBody(() => todoController.finalizeTodo(req, res, id));
      }
      if (req.method === 'PUT') {
        return parseBody(() => todoController.updateTodo(req, res, id));
      }
      if (req.method === 'DELETE') {
        return todoController.deleteTodo(req, res, id);
      }
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'ToDo-Route nicht gefunden.' }));
  }

  /*
   * Gesetzes‑Routen:
   * - POST /api/laws -> erstelle 10–50 Gesetze
   * - GET  /api/laws -> liste Gesetze
   */
  if (pathname === '/api/laws') {
    function parseBody(callback) {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          req.body = body ? JSON.parse(body) : {};
        } catch (e) {
          req.body = {};
        }
        callback();
      });
    }
    if (req.method === 'POST') {
      return parseBody(() => import('./controllers/lawController.js').then(({ createLaws }) => createLaws(req, res)));
    }
    if (req.method === 'GET') {
      return import('./controllers/lawController.js').then(({ listLaws }) => listLaws(req, res));
    }
  }

  /*
   * Ziele‑Route:
   * - GET /api/goals -> gibt strukturierte Daten für das Gantt‑Diagramm zurück
   */
  if (pathname === '/api/goals' && req.method === 'GET') {
    return import('./controllers/goalsController.js').then(({ listGoals }) => listGoals(req, res));
  }

  /*
   * Tagebuch‑Routen:
   * - POST /api/diary               -> erstelle einen Eintrag (optional improve=true)
   * - GET  /api/diary               -> liste alle Einträge
   * - GET  /api/diary?date=YYYY-MM-DD -> liste Einträge eines Datums
   */
  if (pathname === '/api/diary') {
    function parseBody(callback) {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          req.body = body ? JSON.parse(body) : {};
        } catch (e) {
          req.body = {};
        }
        callback();
      });
    }
    if (req.method === 'POST') {
      return parseBody(() => import('./controllers/diaryController.js').then(({ createEntry }) => createEntry(req, res)));
    }
    if (req.method === 'GET') {
      const query = parse(req.url, true).query;
      if (query.date) {
        return import('./controllers/diaryController.js').then(({ listByDate }) => listByDate(req, res, query.date));
      }
      return import('./controllers/diaryController.js').then(({ listEntries }) => listEntries(req, res));
    }
  }

  /*
   * Belohnungs‑Routen:
   * - POST /api/rewards           -> erstelle Belohnung
   * - GET  /api/rewards           -> liste Belohnungen
   * - POST /api/rewards/:id/buy   -> kaufe Belohnung
   */
  if (pathname.startsWith('/api/rewards')) {
    const segments = pathname.split('/').filter(Boolean);
    function parseBody(callback) {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          req.body = body ? JSON.parse(body) : {};
        } catch (e) {
          req.body = {};
        }
        callback();
      });
    }
    // /api/rewards ohne ID
    if (segments.length === 2) {
      if (req.method === 'POST') {
        return parseBody(() => import('./controllers/rewardController.js').then(({ createReward }) => createReward(req, res)));
      }
      if (req.method === 'GET') {
        return import('./controllers/rewardController.js').then(({ listRewards }) => listRewards(req, res));
      }
    }
    // /api/rewards/:id/buy
    if (segments.length === 4 && segments[3] === 'buy' && req.method === 'POST') {
      const rewardId = parseInt(segments[2]);
      if (Number.isNaN(rewardId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Ungültige Belohnungs-ID.' }));
      }
      return import('./controllers/rewardController.js').then(({ buyReward }) => buyReward(req, res, rewardId));
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Belohnungs-Route nicht gefunden.' }));
  }

  /*
   * Benachrichtigungs‑Routen:
   * - POST /api/notifications -> erstelle Erinnerung
   * - GET  /api/notifications -> liste Erinnerungen
   */
  if (pathname === '/api/notifications') {
    function parseBody(callback) {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          req.body = body ? JSON.parse(body) : {};
        } catch (e) {
          req.body = {};
        }
        callback();
      });
    }
    if (req.method === 'POST') {
      return parseBody(() => import('./controllers/notificationController.js').then(({ createNotification }) => createNotification(req, res)));
    }
    if (req.method === 'GET') {
      return import('./controllers/notificationController.js').then(({ listNotifications }) => listNotifications(req, res));
    }
  }

  // Fallback: nicht gefunden
  res.writeHead(404, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify({ message: 'Route nicht gefunden.' }));
});

server.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
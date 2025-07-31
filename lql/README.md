# Life Quest Log – Projektgrundgerüst

Dieses Verzeichnis enthält das Grundgerüst für die Mobile‑App „Life Quest Log (LQL)“.  Die App besteht aus einem separaten Frontend (`app/`), einem Backend mit REST‑API (`backend/`) und einem KI‑Service (`services/ai/`), der die Google Gemini‑API anbindet.  Im Rahmen dieses ersten Schritts wurde eine einfache Benutzerverwaltung mit JWT‑Authentifizierung implementiert, um eine solide Basis für weitere Module (Quests, ToDos, Gesetze, Tagebuch, Belohnungen, Punkte) zu schaffen.

## Struktur

- `app/` – Platzhalter für das mobile Frontend (z. B. React Native oder Flutter).  Der Ordner ist derzeit leer und wird später mit den UI‑Screens gefüllt.
- `backend/`
  - `src/`
    - `controllers/` – Enthält Controller‑Funktionen für einzelne Ressourcen.  Aktuell gibt es einen `userController.js` mit Registrierungs‑ und Login‑Logik.
    - `routes/` – Definiert die REST‑Routen.  `userRoutes.js` stellt `/api/users/register` und `/api/users/login` bereit.
    - `models/` – Minimale Datenmodelle (derzeit ein einfaches In‑Memory‑Usermodell für Demonstrationszwecke).
  - `server.js` – Einstiegspunkt des Backends.  Lädt Umgebungsvariablen, konfiguriert Express und bindet die Routen ein.
  - `package.json` – Beschreibt die Abhängigkeiten und Startskripte des Backends.
  - `.env` – Beispielhafte Konfigurationsdatei mit Platzhaltern für den Gemini‑API‑Key, das Modell, die Basis‑URL sowie Port‑ und JWT‑Einstellungen.
- `services/ai/` – Enthält den Entwurf eines `geminiService.js`, der in Zukunft den Aufruf der Google Gemini‑API kapselt.  Aktuell sind nur Platzhalterfunktionen implementiert.

## Hinweise

* Die aktuelle Implementierung verwendet `bcryptjs` zur Passwort‑Hashing und `jsonwebtoken` zur Erstellung von JWT‑Tokens.  In einer produktiven Umgebung sollten Passwörter in einer persistenten Datenbank gespeichert werden.  Hier dient ein einfacher Array als User‑Store.
* Das Projekt ist so strukturiert, dass weitere Routen (z. B. für Quests, ToDos, Gesetze) problemlos ergänzt werden können.  Lege neue Controller‑ und Routen‑Dateien im entsprechenden Verzeichnis an und binde sie in `server.js` ein.
* Die Datei `.env` darf keine echten Geheimnisse enthalten.  Füge dort deinen Gemini‑API‑Key und das gewünschte Modell ein, wenn du mit der KI‑Integration beginnst.
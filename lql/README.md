# Life Quest Log – Projektgrundgerüst

Dieses Verzeichnis enthält das Grundgerüst für die Mobile‑App „Life Quest Log (LQL)“.  Die App besteht aus einem separaten Frontend (`app/`), einem Backend mit REST‑API (`backend/`) und einem KI‑Service (`services/ai/`), der die Google Gemini‑API anbindet.  Die Umsetzung nutzt **React Native** für die mobile Oberfläche und **Node.js mit Express** für das Backend.  Benutzer können sich registrieren und per JWT anmelden.  Weitere Module (Quests, ToDos, Gesetze, Tagebuch, Belohnungen, Punkte) lassen sich problemlos ergänzen.

## Struktur

- `app/` – Platzhalter für das mobile Frontend (z. B. React Native oder Flutter).  Der Ordner ist derzeit leer und wird später mit den UI‑Screens gefüllt.
- `backend/`
  - `src/`
    - `controllers/` – Enthält Controller‑Funktionen wie `userController.js` und `questController.js`.
    - `routes/` – Definiert die REST‑Routen.  Neben den Nutzer‑Routen gibt es `questRoutes.js` für `/api/quests`.
    - `models/` – Minimale Datenmodelle (derzeit ein einfaches In‑Memory‑Usermodell für Demonstrationszwecke).
  - `server.js` – Einstiegspunkt des Backends.  Lädt Umgebungsvariablen, konfiguriert Express und bindet die Routen ein.
  - `package.json` – Beschreibt die Abhängigkeiten und Startskripte des Backends.
  - `.env.example` – Beispielhafte Konfigurationsdatei mit Platzhaltern für den Gemini‑API‑Key, das Modell, die Basis‑URL sowie Port‑ und JWT‑Einstellungen.  Kopiere diese Datei nach `.env`, um eigene Werte zu hinterlegen.
- `services/ai/` – Enthält den Entwurf eines `geminiService.js`, der in Zukunft den Aufruf der Google Gemini‑API kapselt.  Aktuell sind nur Platzhalterfunktionen implementiert.

## Hinweise

* Die aktuelle Implementierung verwendet `bcryptjs` zur Passwort‑Hashing und `jsonwebtoken` zur Erstellung von JWT‑Tokens.  In einer produktiven Umgebung sollten Passwörter in einer persistenten Datenbank gespeichert werden.  Hier dient ein einfacher Array als User‑Store.
* Das Projekt ist so strukturiert, dass weitere Routen (z. B. für Quests, ToDos, Gesetze) problemlos ergänzt werden können.  Lege neue Controller‑ und Routen‑Dateien im entsprechenden Verzeichnis an und binde sie in `server.js` ein.
* Das Quest‑Modul unterstützt Main‑ und Sidequests mit Etappenzielen.  Der Fortschritt einer Quest ergibt sich aus dem Anteil erledigter Etappenziele.
* Die Datei `.env` darf keine echten Geheimnisse enthalten.  Füge dort deinen Gemini‑API‑Key und das gewünschte Modell ein, wenn du mit der KI‑Integration beginnst.

# Analyse und Implementierungsschritte für das LQL‑Grundgerüst

## Analyse der Kernfunktionen

Das Projekt „Life Quest Log (LQL)“ verfolgt das Ziel, Selbstoptimierung und Gamification in einer einzigen App zu vereinen.  Zentral sind folgende Module:

1. **Quests (Main & Side)** – Der Nutzer definiert Hauptquests mit mehreren Etappenzielen sowie optional Sidequests.  Belohnungen werden an Etappenziele gekoppelt.
2. **Tages‑ToDos** – Tägliche Aufgaben werden mit Schwierigkeitsgraden versehen und in Punkte umgerechnet.  Nicht erledigte Aufgaben erzeugen Abzüge; Best‑Case‑Aufgaben sind optional.
3. **Gesetze** – Selbstdefinierte Regeln, deren Einhaltung über KI geprüft wird.  Für Regelverstöße gibt es Strafpunkte.  Die Gemini‑API kann strukturiertes Feedback liefern【443324611258027†L252-L279】.
4. **Ziele** – Eine Gantt‑ähnliche Übersicht der Main‑Quests und Etappenziele, die Deadlines und Fortschritte visualisiert.
5. **Tagebuch** – Nutzer schreiben tägliche Einträge, die optional von der KI verbessert und getaggt werden.  Mithilfe der Gemini‑API lassen sich lange Kontextfenster (bis zu einer Million Tokens) nutzen, um Monatsanalysen zu erstellen【196489458218576†L258-L305】.
6. **Belohnungen & Punkte** – Punkte können in fiktive Währung umgerechnet werden.  Belohnungen bestehen aus Bildern, Texten oder Amazon‑Links und werden freigeschaltet, wenn genügend Punkte gesammelt wurden.
7. **Gemini‑Integration** – Durch die Nutzung der Gemini‑API können sowohl strukturierte Ausgaben als auch funktionale Aufrufe realisiert werden【91152422045336†L361-L378】【136905756194275†L912-L919】.

## Wahl des Technologie‑Stacks

Für die Umsetzung wurde ein plattformübergreifender Ansatz gewählt:

- **Frontend:** React Native eignet sich gut für schnelle Iterationen und eine einheitliche Codebasis für iOS und Android.  Flutter wäre eine Alternative; die Wahl fiel jedoch auf React Native, da das Team damit vertraut ist und es eine große Community gibt.
- **Backend:** Statt einer komplexen Framework‑Lösung kommt für den Prototyp eine schlanke Node‑Implementierung ohne externe Pakete zum Einsatz.  So entfällt die Paketinstallation, die in der aktuellen Umgebung nicht möglich ist.  Später kann auf Express oder FastAPI migriert werden.
- **Datenbank:** Im Prototyp wird ein In‑Memory‑Store genutzt, damit der Fokus auf der API‑Struktur liegt.  In einer realen App sollte eine persistente Datenbank wie PostgreSQL gewählt werden.

## Projektgerüst und Ordnerstruktur

Das Repository `lql/` besitzt drei Hauptbereiche:

- `app/` – Platzhalter für das mobile Frontend (React Native).  Dieses Verzeichnis wird später die Navigationsstruktur und UI‑Komponenten enthalten.
- `backend/` – Enthält die Node‑basierte REST‑API.  Es gibt einen minimalistischen HTTP‑Server (`src/server.js`), der Benutzerregistrierung und -login ermöglicht.  Die Umgebungsvariablen werden aus einer `.env`‑Datei geladen (Port, JWT‑Secret, Gemini‑Konfiguration).  Die Verzeichnisstruktur ist so gestaltet, dass Controller und Routen für weitere Ressourcen (Quests, ToDos, Gesetze, Tagebuch) ergänzt werden können.
- `services/ai/` – Hier befindet sich `geminiService.js`, das die Kommunikation mit der Google Gemini‑API kapselt.  In der aktuellen Stufe sind lediglich Platzhalterfunktionen implementiert.  Dank der Gemini‑API können strukturierte Antworten und lange Kontextfenster genutzt werden【443324611258027†L252-L279】.

Die Datei `lql/README.md` dokumentiert die Struktur und gibt Hinweise zur weiteren Entwicklung.

## .env‑Konfiguration

Die `.env`‑Datei im `backend/`‑Verzeichnis definiert sensible Parameter wie Port, JWT‑Secret und Gemini‑API‑Einstellungen.  Diese Werte werden zur Laufzeit eingelesen und sollten nicht direkt im Quellcode stehen.

Beispiel:

```
PORT=3000
JWT_SECRET=supersecret
GEMINI_API_KEY=<dein_api_key>
GEMINI_MODEL=gemini-pro
GEMINI_BASE_URL=https://generativelanguage.googleapis.com
```

## Minimalistisches Backend mit REST‑API und JWT

Der `src/server.js` implementiert einen schlanken HTTP‑Server ohne externe Abhängigkeiten.  Er stellt folgende Endpunkte bereit:

| Route | Methode | Beschreibung |
| --- | --- | --- |
| `/` | GET | Liefert eine einfache JSON‑Antwort als Gesundheitscheck. |
| `/api/users/register` | POST | Erstellt einen Benutzer mit Benutzernamen und Passwort.  Passwörter werden mit SHA‑256 gehasht. |
| `/api/users/login` | POST | Prüft die Anmeldedaten und gibt ein selbst gebautes Token zurück. |

Die Token werden mithilfe des `crypto`‑Moduls erstellt, indem Header und Payload Base64‑kodiert und per HMAC‑SHA256 signiert werden.  Dies ersetzt vorerst eine externe JWT‑Bibliothek.  Das Usermodell speichert die Daten in einem Array; in einem späteren Schritt wird dies durch eine Datenbank ersetzt.

## Stolpersteine und geplante Lösungen

* **Paketinstallation:** Da Netzwerkzugriffe in der Umgebung blockiert sind, wurde auf npm‑Pakete wie `express` und `jsonwebtoken` verzichtet.  Eine eigene Implementierung mit `http` wurde gewählt, um vollständig ohne externe Abhängigkeiten auszukommen.
* **Sicherheit:** Der Prototyp verwendet einfache Token und Passwort‑Hashing mit SHA‑256.  Für eine produktive Anwendung muss ein robusteres Authentifizierungsverfahren (z. B. bcrypt, echte JWTs) integriert werden.
* **Persistenz:** Die derzeitige In‑Memory‑Lösung verliert Daten nach dem Neustart.  Sobald möglich, sollte eine Datenbank hinzugefügt und die Models entsprechend angepasst werden.

## Nächste Schritte

Mit diesem Grundgerüst können weitere Module wie Quests, ToDos, Gesetze und Tagebuch implementiert werden.  Für jedes Modul empfiehlt es sich, separate Controller und Routen anzulegen und die Datenmodelle zu modularisieren.  Parallel wird die `geminiService.js` weiterentwickelt, um die Features der Gemini‑API – wie strukturierte Ausgaben【443324611258027†L252-L279】, lange Kontextfenster【196489458218576†L258-L305】 und Funktionsaufrufe【136905756194275†L912-L919】 – sinnvoll zu nutzen.
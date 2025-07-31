/*
 * Controller‑Funktionen für Benutzerregistrierung und Login.
 * Nutzt das User‑Modell sowie jsonwebtoken zur Erstellung eines Tokens.
 */
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";

/**
 * Registriert einen neuen Benutzer.
 */
export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Nutzername und Passwort sind erforderlich." });
    }
    const newUser = await userModel.createUser(username, password);
    if (!newUser) {
      return res.status(400).json({ message: "Benutzername existiert bereits." });
    }
    return res.status(201).json({ message: "Benutzer erstellt.", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registrierung fehlgeschlagen." });
  }
};

/**
 * Meldet einen Benutzer an und gibt einen JWT zurück.
 */
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = userModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Ungültige Anmeldedaten." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Ungültige Anmeldedaten." });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ message: "Login erfolgreich.", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login fehlgeschlagen." });
  }
};
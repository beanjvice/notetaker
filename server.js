import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

console.log("server.js loaded");

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;
const NOTES_FILE = __dirname + "/notes.json";

app.use(bodyParser.json());
app.use(express.static(__dirname)); 

function readNotes() {
    if (!fs.existsSync(NOTES_FILE)) return [];
    const data = fs.readFileSync(NOTES_FILE, "utf-8");
    return JSON.parse(data);
}

function saveNotes(notes) {
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
}

app.get("/notes", (req, res) => {
    console.log("GET /notes");
    res.json(readNotes());
});

app.post("/notes", (req, res) => {
    console.log("POST /notes", req.body);
    const notes = readNotes();
    const newNote = req.body;
    notes.unshift(newNote);
    saveNotes(notes);
    res.status(201).json(newNote);
});

app.delete("/notes/:id", (req, res) => {
    console.log(`DELETE /notes/${req.params.id}`);
    const notes = readNotes();
    const filtered = notes.filter(n => n.id !== req.params.id);
    saveNotes(filtered);
    res.sendStatus(204);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

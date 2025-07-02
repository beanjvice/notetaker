const addButton = document.querySelector(".add");
const notesList = document.querySelector(".added_list");
const notesTitle = document.querySelector(".notes_title");
const notesBody = document.querySelector(".notes_body");

let notes = [];
let activeNoteId = null;

async function loadNotes() {
    const res = await fetch("/notes");
    notes = await res.json();
    renderNotesList();
    if (notes.length > 0) {
        setActiveNote(notes[0].id);
    } else {
        notesTitle.value = "";
        notesBody.value = "";
        activeNoteId = null;
    }
}

async function addNote() {
    const title = notesTitle.value.trim() || "Untitled";
    const body = notesBody.value.trim();
    if (!body && !title) return;

    const newNote = { id: Date.now().toString(), title, body };
    await fetch("/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote)
    });
    await loadNotes();
    setActiveNote(newNote.id);

    notesTitle.value = "";
    notesBody.value = "";
    activeNoteId = null;
}

async function deleteNote(id) {
    await fetch(`/notes/${id}`, { method: "DELETE" });
    await loadNotes();
}

function setActiveNote(id) {
    activeNoteId = id;
    const note = notes.find(n => n.id === id);
    if (note) {
        notesTitle.value = note.title;
        notesBody.value = note.body;
    }
    renderNotesList();
}

function renderNotesList() {
    notesList.innerHTML = "";
    notes.forEach(note => {
        const item = document.createElement("div");
        item.classList.add("list_item");
        if (note.id === activeNoteId) {
            item.classList.add("list_item--selected--selected");
        }
        item.innerHTML = `
            <div class="item_title">${note.title || "Untitled"}</div>
            <div class="item_body">${note.body.substring(0, 30)}...</div>
            <button class="delete-btn">🗑️</button>
        `;
        item.addEventListener("click", () => setActiveNote(note.id));
        item.querySelector(".delete-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            deleteNote(note.id);
        });
        notesList.appendChild(item);
    });
}

addButton.addEventListener("click", addNote);
window.addEventListener("DOMContentLoaded", loadNotes);
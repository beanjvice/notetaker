const addButton = document.querySelector(".add");
const notesList = document.querySelector(".added_list");
const notesTitle = document.querySelector(".notes_title");
const notesBody = document.querySelector(".notes_body");

let notes = [];
let activeNoteId = null;

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
            <div class="item_">${note.body.substring(0, 30)}...</div>
            <button class="delete-btn">🗑️</button>
        `;

        // Select note
        item.addEventListener("click", () => {
            setActiveNote(note.id);
        });

        // Prevent click when delete button is clicked
        item.querySelector(".delete-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            deleteNote(note.id);
        });

        notesList.appendChild(item);
    });
}

function setActiveNote(id) {
    activeNoteId = id;
    const note = notes.find(n => n.id === id);
    notesTitle.value = note.title;
    notesBody.value = note.body;
    renderNotesList();
}

function addNote() {
    const newNote = {
        id: Date.now().toString(),
        title: "New Note",
        body: ""
    };
    notes.unshift(newNote);
    setActiveNote(newNote.id);
    renderNotesList();
}

function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    if (activeNoteId === id) {
        activeNoteId = notes.length ? notes[0].id : null;
    }
    if (activeNoteId) {
        const activeNote = notes.find(n => n.id === activeNoteId);
        notesTitle.value = activeNote.title;
        notesBody.value = activeNote.body;
    } else {
        notesTitle.value = "";
        notesBody.value = "";
    }
    renderNotesList();
}

notesTitle.addEventListener("input", () => {
    const note = notes.find(n => n.id === activeNoteId);
    if (note) {
        note.title = notesTitle.value;
        renderNotesList();
    }
});

notesBody.addEventListener("input", () => {
    const note = notes.find(n => n.id === activeNoteId);
    if (note) {
        note.body = notesBody.value;
        renderNotesList();
    }
});

addButton.addEventListener("click", addNote);

// Initial state
renderNotesList();
notesTitle.value = "";
notesBody.value = "";

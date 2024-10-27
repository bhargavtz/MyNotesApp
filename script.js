// Initialize Quill editor for new notes
const quill = new Quill('#quillEditor', {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline'], // toggled buttons
            ['link', 'image'], // link and image
            [{ list: 'ordered' }, { list: 'bullet' }], // lists
            [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
        ]
    }
});

// Initialize Quill editor for editing notes
const editQuill = new Quill('#editQuillEditor', {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
        ]
    }
});

let notes = []; // Array to store notes
let editingNoteId = null; // Store the ID of the note being edited

// Function to save rich text note
document.getElementById('saveRichTextNoteButton').addEventListener('click', () => {
    const noteContent = quill.root.innerHTML; // Get rich text content
    const note = {
        id: notes.length + 1,
        content: noteContent,
        type: 'richtext'
    };
    notes.push(note);
    quill.setText(''); // Clear editor
    displayNotes();
    const noteModal = bootstrap.Modal.getInstance(document.getElementById('noteModal'));
    noteModal.hide(); // Close modal
});

// Function to save markdown note
document.getElementById('saveMarkdownNoteButton').addEventListener('click', () => {
    const markdownContent = document.getElementById('markdownInput').value; // Get markdown content
    const note = {
        id: notes.length + 1,
        content: markdownContent,
        type: 'markdown'
    };
    notes.push(note);
    document.getElementById('markdownInput').value = ''; // Clear textarea
    displayNotes();
    const markdownModal = bootstrap.Modal.getInstance(document.getElementById('markdownModal'));
    markdownModal.hide(); // Close modal
});

// Function to display notes
function displayNotes() {
    const noteList = document.getElementById('noteList');
    noteList.innerHTML = ''; // Clear previous notes

    notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('card', 'mb-3', 'p-3');
        noteDiv.innerHTML = `
            <h5 class="card-title">${note.type === 'richtext' ? 'Rich Text Note' : 'Markdown Note'}</h5>
            <div class="card-text">${note.type === 'richtext' ? note.content : markdownToHtml(note.content)}</div>
            <button class="btn btn-info me-2" onclick="editNote(${note.id})">Edit Note</button>
            <button class="btn btn-danger" onclick="deleteNote(${note.id})">Delete Note</button>
            <button class="btn btn-success" onclick="saveText(${note.id})">Save as Text</button>
            <button class="btn btn-warning" onclick="savePDF(${note.id})">Save as PDF</button>
        `;
        noteList.appendChild(noteDiv);
    });
}

// Function to delete a note
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    displayNotes();
}

// Edit note function
function editNote(id) {
    const note = notes.find(note => note.id === id);
    editingNoteId = id;
    editQuill.root.innerHTML = note.content; // Load content into editor
    const editNoteModal = new bootstrap.Modal(document.getElementById('editNoteModal'));
    editNoteModal.show();
}

// Update note
document.getElementById('updateNoteButton').addEventListener('click', () => {
    const updatedContent = editQuill.root.innerHTML; // Get updated content
    notes = notes.map(note => note.id === editingNoteId ? { ...note, content: updatedContent } : note);
    editQuill.setText(''); // Clear editor
    displayNotes();
    const editNoteModal = bootstrap.Modal.getInstance(document.getElementById('editNoteModal'));
    editNoteModal.hide(); // Close modal
});

// Function to convert markdown to HTML
function markdownToHtml(markdown) {
    const converter = new showdown.Converter();
    return converter.makeHtml(markdown);
}

// Function to save note as text file
function saveText(id) {
    const note = notes.find(note => note.id === id);
    const blob = new Blob([note.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `note_${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Function to save note as PDF
function savePDF(id) {
    const note = notes.find(note => note.id === id);
    const doc = new jsPDF();
    doc.fromHTML(note.content, 15, 15, {
        width: 190,
    });
    doc.save(`note_${id}.pdf`);
}

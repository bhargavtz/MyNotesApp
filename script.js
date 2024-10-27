document.addEventListener('DOMContentLoaded', function () {
    const addNoteButton = document.getElementById('addNoteButton');
    const saveNoteButton = document.getElementById('saveNoteButton');
    const noteList = document.getElementById('noteList');
    const noteInput = document.getElementById('noteInput');
    const markdownInput = document.getElementById('markdownInput');
    const searchInput = document.getElementById('searchInput');

    let notes = [];

    // Rich Text Editor Initialization
    const quill = new Quill('#editor', {
        theme: 'snow',
    });

    // Function to add a new note
    function addNote() {
        const content = quill.root.innerHTML;
        const markdownContent = markdownInput.value;
        if (!content && !markdownContent) {
            alert('Please enter some content to save the note.');
            return;
        }

        const newNote = {
            id: Date.now(),
            content: content,
            markdown: markdownContent
        };

        notes.push(newNote);
        renderNotes();
        clearInputs();
    }

    // Function to render notes on the page
    function renderNotes() {
        noteList.innerHTML = '';
        notes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.classList.add('note-card', 'p-4', 'mb-4');
            noteCard.innerHTML = `
                <div class="note-content">${note.content || ''}</div>
                <div class="markdown-preview">${marked(note.markdown || '')}</div>
                <button class="btn btn-sm btn-danger mt-2" onclick="deleteNote(${note.id})">Delete</button>
                <button class="btn btn-sm btn-secondary mt-2" onclick="saveNoteAsText(${note.id})">Save as Text</button>
                <button class="btn btn-sm btn-secondary mt-2" onclick="saveNoteAsPDF(${note.id})">Save as PDF</button>
            `;
            noteList.appendChild(noteCard);
        });
    }

    // Function to clear inputs
    function clearInputs() {
        quill.root.innerHTML = '';
        markdownInput.value = '';
    }

    // Function to delete a note
    window.deleteNote = function (id) {
        notes = notes.filter(note => note.id !== id);
        renderNotes();
    };

    // Function to save a note as text file
    window.saveNoteAsText = function (id) {
        const note = notes.find(n => n.id === id);
        if (!note) return;

        const textContent = `Rich Text:\n${note.content}\n\nMarkdown:\n${note.markdown}`;
        const blob = new Blob([textContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'note.txt';
        link.click();
    };

    // Function to save a note as PDF
    window.saveNoteAsPDF = function (id) {
        const note = notes.find(n => n.id === id);
        if (!note) return;

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        pdf.text('Rich Text:', 10, 10);
        pdf.fromHTML(note.content, 10, 20);
        pdf.text('Markdown:', 10, pdf.autoTable.previous.finalY + 10);
        pdf.text(note.markdown, 10, pdf.autoTable.previous.finalY + 20);

        pdf.save('note.pdf');
    };

    // Search notes functionality
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        const filteredNotes = notes.filter(note =>
            note.content.toLowerCase().includes(query) ||
            note.markdown.toLowerCase().includes(query)
        );
        renderFilteredNotes(filteredNotes);
    });

    function renderFilteredNotes(filteredNotes) {
        noteList.innerHTML = '';
        filteredNotes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.classList.add('note-card', 'p-4', 'mb-4');
            noteCard.innerHTML = `
                <div class="note-content">${note.content || ''}</div>
                <div class="markdown-preview">${marked(note.markdown || '')}</div>
                <button class="btn btn-sm btn-danger mt-2" onclick="deleteNote(${note.id})">Delete</button>
                <button class="btn btn-sm btn-secondary mt-2" onclick="saveNoteAsText(${note.id})">Save as Text</button>
                <button class="btn btn-sm btn-secondary mt-2" onclick="saveNoteAsPDF(${note.id})">Save as PDF</button>
            `;
            noteList.appendChild(noteCard);
        });
    }

    // Add note event listener
    saveNoteButton.addEventListener('click', addNote);
});

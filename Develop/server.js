const express = require('express');
const path = require('path');
const fs = require('fs');

const notesDb = require('./db/db.json');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) =>
    res.status(200).json(notesDb)
);

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body
    // fs.readFileSync('./db/db.json')
    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid()
        };

        const response = {
            status: 'success',
            body: newNote,
        };

        res.status(201).json(response);
    } else {
        res.status(500).json('Error in creating new note')
    };
});

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
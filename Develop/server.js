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
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid()
        };

        notesDb.push(newNote);
        fs.writeFileSync('./db/db.json', JSON.stringify(notesDb));
        res.status(201);
    } else {
        res.status(500).json('Error in creating new note')
    };
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id
    const allNotes = JSON.parse(fs.readFileSync('./db/db.json'))

    allNotes.forEach(element => {
        if(noteId === element.id){
            allNotes.splice(allNotes.indexOf(element), 1)
            fs.writeFileSync('./db/db.json', JSON.stringify(allNotes))
        }
    });
})

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
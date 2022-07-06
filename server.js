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

//Serves up index.html at the root route
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

//Takes the user to the /notes page when they click on the 'get started' button
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//Get notes from the database to display
app.get('/api/notes', (req, res) =>
    res.json(notesDb)
);

//Post a new note
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid()
        };

        notesDb.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(notesDb), (err, data) => {
            if (err) throw err;
        });
        res.status(201).json(notesDb);
    } else {
        res.status(500).json('Error in creating new note')
    };
});

//Delete a note based on its ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id
    const allNotes = JSON.parse(fs.readFileSync('./db/db.json'))

    allNotes.forEach(element => {
        if(noteId === element.id){
            allNotes.splice(allNotes.indexOf(element), 1)
        }
    })
    fs.writeFile('./db/db.json', JSON.stringify(allNotes), (err, data) => {
        if (err) throw err;
        res.status(200).json(allNotes);
    })
})

//Wildcard route for any path that's not previously defined
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`))
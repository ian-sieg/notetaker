const express = require('express');
const path = require('path')
// const api = require('./routes/index.js')
const notes = require('./db/db.json')
const PORT = process.env.PORT || 3001;
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'db/db.json'))
);

app.post('/api/notes', (req, res) =>
    res.json(notes)
);

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
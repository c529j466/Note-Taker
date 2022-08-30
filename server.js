const express = require('express');
const path = require('path');
const notesDB = require('./db/db.json');
const fs = require("fs");
const util = require("util");
const uuid = require("./helpers/uuid");

const PORT = process.env.port || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) =>
  res.json(notesDB)
);

app.post('/api/notes', (req, res) => {
  const { body } = req;
  notesDB.push(body);
  res.json(notesDB)
});

app.delete('/api/notes/', (req, res) => {
    console.log("DELETE Request Called for /api endpoint")
        res.send("DELETE Request Called")
    }); 

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

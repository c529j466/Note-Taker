// Requires numerous files and libraries
const express = require('express');
const path = require('path');
const notesDB = require('./db/db.json');
const fs = require("fs");
const util = require("util");
const uuid = require("./helpers/uuid");

// Sets the PORT variable to a specfic port to listen on
const PORT = process.env.port || 3001;

// Sets express to a variable
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Returns callbacks as promises 
const readContent = util.promisify(fs.readFile);

// Creates function for writing content to the db.json
const writeContent = (location, content) => 
    fs.writeFile(location, JSON.stringify(content, null, 4), (err) => 
        err ? console.error(err) : console.info(`\nData written to ${location}`)
    );

// Creates function for appending db.json 
const appendContent = (content, file) => {
    fs.readFile(file, "utf8", (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};

// Attaching readContent function to notes for persistance
app.get("/api/notes", (req, res) => {
    console.info(`${req.method} request received to get notes`)
    readContent("./db/db.json").then((data) => res.status(200).json(JSON.parse(data)));
});

// Creates POST route for notes
app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received to add a note`);
    console.info(req.rawHeaders);

// Sets title and text to the body of the request
    const { title, text } = req.body;
// Sets an id to the request using UUID function from helpers folder
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
// Sets new note to the db.json file 
        appendContent(newNote, "./db/db.json");

        return res.status(201).json(response);
    } 
    else {
        return res.status(500).json("Error in posting note");
    }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

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

// Creates function for writing content to files
const writeContent = (location, content) => 
    fs.writeFile(location, JSON.stringify(content, null, 4), (err) => 
        err ? console.error(err) : console.info(`\nData written to ${location}`)
    );

// Creates function for appending files 
const appendContent = (content, file) => {
    fs.readFile(file, "utf8", (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeContent(file, parsedData);
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
// Sets an id to the request using UUID function from helpers folder and creates variable object for title, text, and assigned id
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
// Sets new note to the db.json file 
        appendContent(newNote, "./db/db.json");

        const response = {
            status: "success",
            body: newNote,
        };

        return res.status(201).json(response);
    } 
// Returns error if note could not be posted
    else {
        return res.status(500).json("Error in posting note");
    }
});

// Creates route to delete notes
app.delete("/api/notes/:id", (req, res) => {
    console.info(`${req.method} request received to remove a note`);
 
// Reading through db.json then sets parsed data to a variable 
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        console.log(data);
// Creates an id parameter, parses data, and creates a variable to find note ids from parsed data
        const id = req.params.id;
        const parsedNotes = JSON.parse(data);
        const deleteNote = parsedNotes.find(note => note.id === id);
// If the data has an id, creates new array of data without that id and then writes it to the db.json file.
        if (deleteNote) {
            data = parsedNotes.filter(note => note.id !== id);
            writeContent("./db/db.json", data);
            return res.status(200).json(toDelete);
        } else {
            return res.status(404).json("There doesn't exist a Note with such id");
        }
    })
}); 
// Creates wildcard GET route
app.get("*", (req, res) => 
    res.sendFile(path.join(__dirname, "public/index.html"))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

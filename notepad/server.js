const express = require('express');
const fs = require('fs');
var cors = require('cors')
const app = express();
const port = 4000;
app.use(cors());

var notes = [];
var categories = [];
var users = ['user1', 'user2', 'user3'];
var loggedInUser = '';

class Note {
    constructor(title, content, date, category) {
        this.title = title;
        this.content = content;
        this.date = date;
        this.category = category;
    }
}

class Category {
    constructor(name) {
        this.name = name;
        this.id = categories.length;
    }
}

function testServerInit() {
    categories.push(new Category('Shopping'));
    categories.push(new Category('Work'));
    categories.push(new Category('University'));

    notes.push(new Note('Zakupy', '1x Ser\n1x Salami \n1x Chleb', new Date().toJSON().slice(0, 10), 'Shopping'));
    notes.push(new Note('Kolokwia', 'Kolokwium 30.05', new Date().toJSON().slice(0, 10), 'University'));
}

function saveData() {
    fs.writeFileSync(loggedInUser + '.json', JSON.stringify({ notes: notes, categories: categories }));
}

function loadData() {
    notes = JSON.parse(fs.readFileSync(loggedInUser + '.json')).notes;
    categories = JSON.parse(fs.readFileSync(loggedInUser + '.json')).categories;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
    if (req.body.user && users.filter(user => user == req.body.user).length > 0) {
        loggedInUser = req.body.user;
        loadData();
        res.send({ 'success': true, 'categories': categories, 'notes': notes });
    }
    else
        res.send({ 'success': false });
});
app.post('/logout', (req, res) => {
    saveData();
    loggedInUser = '';
    res.send({});
});
app.post('/note', (req, res) => {
    if (req.body.title && req.body.content && req.body.date && req.body.category) {
        notes.push(new Note(req.body.title, req.body.content, req.body.date, req.body.category));
        saveData();
    }
    res.send({ 'categories': categories, 'notes': notes });
});
app.post('/newCat', (req, res) => {
    if (req.body.name) {
        categories.push(new Category(req.body.name));
        saveData();
    }
    res.send({ 'categories': categories, 'notes': notes });
});
app.post('/editCat', (req, res) => {
    if (req.body.name && req.body.id) {
        categories.filter(el => el.id == req.body.id)[0].name = req.body.name;
        saveData();
    }
    res.send({ 'categories': categories, 'notes': notes });
});
app.post('/deleteCat', (req, res) => {
    if (req.body.name) {
        categories = categories.filter(el => el.name != req.body.name);
        saveData();
    }
    res.send({ 'categories': categories, 'notes': notes });
});


app.listen(port, () => console.log(`Notes server listening on port ${port}!`));

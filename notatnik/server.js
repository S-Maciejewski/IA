const express = require('express');
var cors = require('cors')
const app = express();
const port = 4000;
const passwd = '123';
app.use(cors());

var notes = [];
var categories = [];

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

function serverInit() {
    categories.push(new Category('Shopping'));
    categories.push(new Category('Work'));
    categories.push(new Category('University'));

    notes.push(new Note('Zakupy', '1x Ser\n1x Salami \n1x Chleb', new Date().toJSON().slice(0, 10), 'Shopping'));
    notes.push(new Note('Kolokwia', 'Kolokwium 30.05', new Date().toJSON().slice(0, 10), 'University'));
}

serverInit();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/init', (req, res) => res.send({ 'categories': categories, 'notes': notes }));
app.post('/login', (req, res) => {
    if (req.body.passwd && req.body.passwd == passwd)
        res.send({ 'success': true });
    else
        res.send({ 'success': false });
});
app.post('/note', (req, res) => {
    if (req.body.title && req.body.content && req.body.date && req.body.category)
        notes.push(new Note(req.body.title, req.body.content, req.body.date, req.body.category));
    res.send({ 'categories': categories, 'notes': notes });
});
app.post('/newCat', (req, res) => {
    if (req.body.name)
        categories.push(req.body.name);
    res.send({ 'categories': categories, 'notes': notes });
});
app.post('/editCat', (req, res) => {
    if (req.body.name && req.body.id)
        categories.filter(el => el.id == req.body.id)[0].name = req.body.name;
    res.send({ 'categories': categories, 'notes': notes });
});
app.post('/deleteCat', (req, res) => {
    if (req.body.name)
        categories = categories.filter(el => el.name != req.body.name);
    res.send({ 'categories': categories, 'notes': notes });
});


app.listen(port, () => console.log(`Notes server listening on port ${port}!`));

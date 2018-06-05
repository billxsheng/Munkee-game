const express = require('express');
const hbs = require('hbs');
var app = express();
const path = require('path');

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, '../views')));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/online', (req, res) => {
    res.render('select');
});

app.get('/online/create',(req, res) => {
    res.render('create');
});

app.get('/online/join', (req, res) => {
    res.render('join');
});

app.get('/online/room', (req, res) => {
    res.render('room');
});

app.listen(3000, () => {
    console.log('started');
})
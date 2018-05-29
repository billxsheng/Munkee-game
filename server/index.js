const express = require('express');
const hbs = requrie('hbs');
var app = express();

app.get('/', (req, res) => {
    res.render(__dirname+"../home.html");
});

app.get('/online', (req, res) => {
    res.render('redirect');
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
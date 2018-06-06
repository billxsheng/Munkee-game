const express = require('express');
const hbs = require('hbs');
var app = express();
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '../views')));
var server = http.createServer(app);
var io = socketIO(server);


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/online', (req, res) => {
    res.render('select');
});

app.get('/online/create',(req, res) => {
    res.render('create');
});

app.post('/online/create/redirect', (req, res) => {

});

app.get('/online/join', (req, res) => {
    res.render('join');
});

app.post('/online/join/redirect', (req, res) => {

});

app.get('/online/room', (req, res) => {
    res.render('room');
});

io.on('connection', (socket) => {
    console.log('User connected.');
});

server.listen(3000, () => {
    console.log('started');
})
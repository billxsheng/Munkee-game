//require statements
const express = require('express');
const hbs = require('hbs');
var app = express();
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const url = require('url');
const uniqId = require('uniqid');

//active array 
var activeGames = [];

//new id function
var newId = ((id) => {
    return new Promise((resolve, reject) => {
        if(activeGames.includes(id) === true) {
            Promise.reject();
        }
        else {
            activeGames.push(id);
            console.log(activeGames);
            resolve();
        }
    });
});

//scan id function
var scanId = ((id) => {

});

//setting hbs module
app.set('view engine', 'hbs');

//connecting statics
app.use(express.static('views'));
app.use(express.static('online'));

//socket.io config
var server = http.createServer(app);
var io = socketIO(server);

//body parser
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//getting home page
app.get('/', (req, res) => {
    res.render('home');
});

//route for online multiplayer mode
app.get('/online', (req, res) => {
    res.render('select');
});

//route to create a room
app.get('/online/create',(req, res) => {
    res.render('create');
});

//posting room data
app.post('/online/create/redirect', urlencodedParser, (req, res) => {
    console.log(req.body);
    var id = uniqId();
    console.log(id);
    newId((id) => {
        console.log("id taken into method");
    }).then(() => {
        console.log('Successfully added to active games.');
        console.log(activeGames);
    }).catch((e) => {
        res.send('An unexpected error occured.')
    })
    //add id into array of active id's
    res.redirect(url.format({
        pathname:"/online/room/",
        query: {
            "id": id,
            "hostname": req.body.name
        }
    }));
    hbs.registerHelper('getRoomId', () => {
        return id;
    });
    hbs.registerHelper('getHostName', () => {
        return req.body.name;
    });
    hbs.registerHelper('fetchMsg', () => {
        return "HOST CONNECTED";
    });
});

//joining room data
app.post('/online/join/redirect', (req, res) => {
    console.log(req.body);
});

//route to join a room
app.get('/online/join', (req, res) => {
    res.render('join');
});

//route to join a room
app.get('/online/room/' /*room id*/, (req, res) => {
    res.render('room');
    //use url module
});


//socket serverside connection
io.on('connection', (socket) => {
    console.log('User connected.');

    socket.on('join', (query) => {
        console.log('room joined');
        console.log(query);
        socket.join(query.id);
        console.log('joined room', query.id);
    });
});


//listen
server.listen(3000, () => {
    console.log('started');
});
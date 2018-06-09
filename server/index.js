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
            console.log('new id succeeded')
            activeGames.push(id);
            activeGames.forEach(function(item, index, array) {
                console.log(item, index);
            });

            resolve();
        }
    });
});

//scan id function
var scanId = ((id) => {
    return new Promise((resolve, reject) => {
        if(activeGames.includes(id) === true) {
            resolve();
        }
        else {
            Promise.reject();
        }
    });
});

//check game middleware
var gameCheck = ((req, res, next) => {
    //check active games
    if(req.query.id == undefined) {
        res.redirect('/');
    } else {
        next();
    }
});

//setting hbs module
app.set('view engine', 'hbs');

//connecting statics
app.use(express.static('views'));
app.use(express.static('online'));
const port = process.env.PORT || 3000;

//socket.io config
var server = http.createServer(app);
var io = socketIO(server);
app.io = io;

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
    var id = uniqId();
    console.log(id);
    newId((id)).then(() => {
        console.log('Successfully added to active games.');
    }).catch((e) => {
        res.send('An unexpected error occured.');
    })
    //add id into array of active id's
    res.redirect(url.format({
        pathname:"/online/room/",
        query: {
            "id": id,
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

    hbs.registerHelper('getP2Name', () => {
        return "Player 2 ...";
    });
});

//joining room data
app.post('/online/join/redirect', urlencodedParser, (req, res) => {
    console.log(req.body.id);
    // scanId((req.body.id)).then(() => {
    //     res.redirect(url.format({
    //         pathname:"/online/room/",
    //         query: {
    //             "id": id,
    //             "hostname": req.body.name
    //         }
    //     }));
    // }).catch(() => {
    //     res.send('Invalid ID.');
    // });
    res.redirect(url.format({
                pathname:"/online/room/",
                query: {
                    "id": req.body.id,
                },
    }));

    hbs.registerHelper('getP2Name', () => {
        return req.body.name;
    });

    hbs.registerHelper('fetchMsg', () => {
        return "P2 CONNECTED";
    });

    io.in(req.body.id).emit('p2Update', {
        name: req.body.name
    });

    io.in(req.body.id).emit('startGameBtn');
});

//route to join a room
app.get('/online/join', (req, res) => {
    res.render('join');
});

//route to join a room
app.get('/online/room', gameCheck, (req, res) => {
    res.render('room');
    //use url module
});


//socket serverside connection
io.on('connection', (socket) => {
    console.log('User connected.');

    socket.on('join', (query) => {
        console.log(io.of('/').in(query.id).clients);
        if((io.of('/').in(query.id).clients.length) < 2) {
            socket.join(query.id);
            console.log('joined room', query.id);
        } else {
            console.log('max players exceeded');
        }
    });

    socket.on('requestTurnScore', (data) => {
        io.in(data.id).emit('updateTurnScore', {
            score: data.roundScore,
            turn: data.playerTurn
        });
    });

    socket.on('requestHold', (data) => {
        io.in(data.id).emit('updateHoldScore', {
            scores: data.scores,
            turn: data.playerTurn
        });
    });

    socket.on('requestNew', (data) => {
        console.log('request new');
        io.in(data.id).emit('updateNew');
        io.in(data.id).emit('pairOff');
        socket.emit('startGameBtn');
        //change message new game
    });

    socket.on('hostTurnRequestFirst', (data) => {
        socket.emit('hostTurnFirst');
        //change message game started by host
    });

    socket.on('switchcolor', function(data) {
        io.in(data.id).emit('switchColor');
    });

    socket.on('requestHostTurn', (data) => {
        socket.emit('pairOff', {
            data
        });
        socket.broadcast.to(data.id).emit('hostOn', {
            data
        });
         //change message player 1 turn
    });

    socket.on('requestPairTurn', (data) => {
       socket.emit('hostOff', {
           data
       });
       socket.broadcast.to(data.id).emit('pairOn', {
           data
       });
       socket.emit('startBtnDisable');
       //change message player 2 turn 
    });

    socket.on('playerTurnVar', (data) => {
        io.in(data.id).emit('playerTurn', {
            turn:data.turn
        });
    });


    socket.on('createGame', () => {
        socket.emit('hostJoined', {
            
        })
    })

});

//listen
server.listen(port, () => {
    console.log(`started ${port}`);
});
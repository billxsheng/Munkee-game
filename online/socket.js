var socket = io();

var holdbtn = document.getElementById('btn-hold').classList;
var rollbtn = document.getElementById('btn-roll').classList;
var startbtn = document.getElementById('btn-start').classList;
var newbtn = document.getElementById('btn-new').classList;
var score0 = document.getElementById('score0');
var score1 = document.getElementById('score1');
var currScore0 = document.getElementById('curr-score0');
var currScore1 = document.getElementById('curr-score1');
var msg = document.getElementById('message');
var textP0 = document.querySelector("#text-p0");
var textP1 = document.querySelector("#text-p1");

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

socket.on('connect', () => {
    var query = parseQuery(window.location.search);
    socket.emit('join', query, () => {
    });
});

//toggle colors
function toggleColor() {
    textP0.classList.toggle("act");
    score0.classList.toggle("act");
    currScore0.classList.toggle("act");
    textP1.classList.toggle("act");
    score1.classList.toggle("act");
    currScore1.classList.toggle("act");
}

//turn switch algorithm
socket.on('hostTurnFirst', function () {
    holdbtn.remove('disabled');
    rollbtn.remove('disabled');
});

socket.on('pairOff', function () {
    holdbtn.add('disabled');
    rollbtn.add('disabled');
});

socket.on('hostOn', function (data) {
    holdbtn.remove('disabled');
    rollbtn.remove('disabled');
});

socket.on('hostOff', function (data) {
    holdbtn.add('disabled');
    rollbtn.add('disabled');
});

socket.on('pairOn', function (data) {
    holdbtn.remove('disabled');
    rollbtn.remove('disabled');
});

socket.on('startBtnDisable', function () {
    startbtn.add('disabled');
});

//color switch algorithm
socket.on('switchColor', function () {
    toggleColor();
});

//updating roll score
socket.on('updateTurnScore', function (data) {
    document.getElementById('dice').style.display = 'block';
    document.getElementById('hold-msg').style.display = 'none';
    document.getElementById('curr-score' + data.turn).textContent = data.score;
    diceDom = document.querySelector('#dice');
    diceDom.src = "/images/dice" + data.dice + ".png";
});

//updating hold score
socket.on('updateHoldScore', function (data) {
    document.getElementById('score' + data.turn).textContent = data.scores[data.turn];
    document.getElementById('curr-score' + data.turn).textContent = 0;
    document.getElementById('dice').style.display = 'none';
    document.getElementById('hold-msg').style.display = 'block';
});

//updating new game
socket.on('updateNew', function (data) {
    scores = [0,0];
    roundScore = 0;
    score1.textContent = 0;
    currScore1.textContent = 0;
    score0.textContent = 0;
    currScore0.textContent = 0;
    msg.textContent = "New Game";
    textP0.textContent = data.host;
    textP1.textContent = data.pair;
});

//p2 join update
socket.on('p2Update', function (data) {
    textP1.textContent = data.name;
    msg.textContent = "waiting for host to start game";
});

//turn messages
socket.on('pairTurnMessage', function (data) {
    msg.textContent = data.pairName + "'s turn";
});

socket.on('hostTurnMessage', function (data) {
    msg.textContent = data.hostName + "'s turn";
});

//showing dice one roll
socket.on('diceOne', function () {
    diceDom = document.querySelector('#dice');
    diceDom.src = "/images/dice1.png";
});

//start game btn
socket.on('startGameBtn', function (data) {
    startbtn.remove('disabled');
    newbtn.remove('disabled');
});

//returning player turn number
socket.on('playerTurn', function (data) {
    playerTurn = data.turn;
});

//resetting current scores to 0
socket.on('zero', function () {
    currScore0.textContent = 0;
    currScore1.textContent = 0;
});

//message to start the game
socket.on('gameStartMessage', function () {
    startbtn.add('disabled');
    msg.textContent = "game started by host";
    document.getElementById('dice').style.display = 'block';
    document.getElementById('dice').src = "/images/dice1.png";
    document.getElementById('hold-msg').style.display = 'none';
});

//resets picture on start
socket.on('picReset', function() {

});

//message when a player wins
socket.on('playerWin', function (data) {
    msg.textContent = data.name + " won!";
    document.querySelector("#text-p" + data.turn).textContent = "winner!";
    scores = [0,0];
    roundScore = 0;
    startbtn.add('disabled');
});

//btns on pair when p2 joins
socket.on('p2BtnUpdate', function () {
    rollbtn.remove('disabled');
});

//disconnect
socket.on('disconnect', function () {
    msg.textContent = "lobby closed because your opponent left";
    msg.style.color = "red";
    msg.style.fontSize = "15px";
    holdbtn.add('disabled');
    startbtn.add('disabled');
    rollbtn.add('disabled');
    newbtn.add('disabled');
    score0.textContent = 0;
    score1.textContent = 0;
    currScore0.textContent = 0;
    currScore1.textContent = 0;
});

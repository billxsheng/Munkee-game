var socket = io(); 

var holdbtn = document.getElementById('btn-hold').classList;
var rollbtn = document.getElementById('btn-roll').classList;

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
    console.log('Connected to the server.');
    console.log(window.location.search);
    var query = parseQuery(window.location.search);
    console.log(query);
    socket.emit('join', query, () => {

    });
});

//turn switch algorithm
socket.on('hostTurnFirst', function() {
    console.log('hostTurn');
    holdbtn.remove('disabled');
    rollbtn.remove('disabled');
});

//updating roll score
socket.on('updateTurnScore', function(data) {
    console.log(data.turn, data.score);
    document.getElementById('curr-score' + data.turn).textContent = data.score;
});

//updating hold score
socket.on('updateHoldScore', function(data) {
    document.getElementById('score' + data.turn).textContent = data.scores[data.turn];
    document.getElementById('curr-score' + data.turn).textContent = 0;
});

//updating new game
socket.on('updateNew', function(data) {
    document.getElementById('score1').textContent = 0;
    document.getElementById('curr-score1').textContent = 0;
    document.getElementById('score2').textContent = 0;
    document.getElementById('curr-score2').textContent = 0;
});

//p2 join update
socket.on('p2Update', function(data) {
    document.getElementById('text-p1').textContent = data.name; 
    document.getElementById('message').textContent = "P2 Connected";
    // document.getElementById('btn-new').classList.remove('disabled');
    // document.getElementById('btn-hold').classList.remove('disabled');
    // document.getElementById('btn-roll').classList.remove('disabled');

    //enable btns
});

//start game btn
socket.on('startGameBtn', function(data) {
    document.getElementById('btn-start').classList.remove('disabled');
    document.getElementById('btn-new').classList.remove('disabled');  
});


socket.on('p2BtnUpdate', function() {
    document.getElementById('btn-roll').classList.remove('disabled');
});
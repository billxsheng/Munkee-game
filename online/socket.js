var socket = io(); 

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

socket.on('updateTurnScore', function(data) {
    console.log(data.turn, data.score);
    document.getElementById('curr-score' + data.turn).textContent = data.score;
});

socket.on('updateHoldScore', function(data) {
    document.getElementById('score' + data.turn).textContent = data.scores[data.turn];
    document.getElementById('curr-score' + data.turn).textContent = 0;
});

socket.on('p2Update', function(data) {
    document.getElementById('text-p1').textContent = data.name; 
    document.getElementById('message').textContent = "P2 Connected";
    document.getElementById('btn-new').classList.remove('disabled');
    document.getElementById('btn-hold').classList.remove('disabled');
    document.getElementById('btn-roll').classList.remove('disabled');

    //enable btns
});
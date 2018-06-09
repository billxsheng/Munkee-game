var scores = [0,0];
var playerTurn = 0;
var currentScore1 = 0;
var currentScore2 = 0;
var roundScore = 0;
var winningScore = 100;
var player1Name = "player 1";
var player2Name = "player 2";
var query = parseQuery(window.location.search);


// document.getElementById('copy').addEventListener('click', function() {
//     var copyText = document.getElementById('roomId').innerHTML;
//     document.execCommand('copy');
//     alert('Room ID copied!');
// });

document.querySelector(".btn-roll").addEventListener('click', function() {
    var dice = Math.floor((Math.random()*5)+1);
    diceDom = document.querySelector('.dice');
    diceDom.src = "/images/dice" + dice + ".png";
    console.log(dice);
    if(dice != 1) {
        roundScore += dice;
        document.getElementById("curr-score"+playerTurn).textContent = roundScore;
        var query = parseQuery(window.location.search);
        console.log(query.id);
        socket.emit('requestTurnScore', {
            roundScore,
            playerTurn,
            id:query.id,
            dice
        });
    }
    else {
        var query = parseQuery(window.location.search);
        socket.emit('zeroRequest', {
            turn: playerTurn,
            id: query.id
        });
        nextPlayer();
    }
});

document.querySelector(".btn-hold").addEventListener('click', function() {
    scores[playerTurn] += roundScore;
    document.querySelector("#score" + playerTurn).textContent = scores[playerTurn];
    var query = parseQuery(window.location.search);
    socket.emit('requestHold', {
       playerTurn,
       id:query.id,
       scores
    });
   if(scores[playerTurn] >= winningScore) {
       socket.emit('playerWinRequest', {
           name: document.getElementById('text-p' +playerTurn).innerHTML,
           playerTurn,
           id: query.id
       });
       document.querySelector("#text-p" + playerTurn).textContent = "winner!";
       document.querySelector(".btn-hold").classList.add("disabled");
       document.querySelector(".btn-roll").classList.add("disabled");
    } else {
        nextPlayer();
    }
    
    
});

document.getElementById('btn-start').addEventListener('click', function() {
    socket.emit('hostTurnRequestFirst', {id:query.id});
});

document.querySelector(".btn-new").addEventListener("click", function() {
    console.log('new game');
    roundScore=0;
    scores = [0,0];
    var query = parseQuery(window.location.search);
    if(playerTurn == 1) {
        nextPlayer();
    }
    socket.emit('requestNew', {
       id:query.id
    });
});

function checkTurn() {
    var hostName = document.getElementById('text-p0').innerHTML;
    var pairName = document.getElementById('text-p1').innerHTML;
    if(playerTurn === 0) {
        console.log('0');
        socket.emit('requestHostTurn', {
            id: query.id,
            turn: playerTurn,
            hostName
        });
    } else if(playerTurn === 1) {
        console.log('1');
        socket.emit('requestPairTurn', {
            id: query.id,
            turn:playerTurn,
            pairName
        });
    }
};

function switchColor() {
    socket.emit('switchcolor', {
        id:query.id
    });
}

function nextPlayer() {
    roundScore = 0;
    var query = parseQuery(window.location.search);
    if(playerTurn === 0) {
        playerTurn = 1;
    } else {
        playerTurn = 0;
    };
    socket.emit('playerTurnVar', {
        id: query.id,
        turn: playerTurn
    });
    checkTurn();
    switchColor();
}



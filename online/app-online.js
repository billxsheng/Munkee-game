console.log('reset');
var scores = [0,0];
var playerTurn = 0;
var currentScore1 = 0;
var currentScore2 = 0;
var roundScore = 0;
var winningScore = 100;
var player1Name = "player 1";
var player2Name = "player 2";
var query = parseQuery(window.location.search);


// document.getElementById('btn-roll').addEventListener('click', function() {
//     var query = parseQuery(window.location.search);
//     console.log(query.id);
//     io.in(query.id).emit('updateTurnScore', {

//     })
// });


// document.querySelector('.btn-p1').addEventListener("click", function(){
//     document.querySelector("#text-p0").textContent = document.querySelector('.p1-name').value;
//     player1Name = document.querySelector('.p1-name').value;
//     console.log(`Player 1 name changed to ${document.querySelector('.p1-name').value}`);
// });

// document.querySelector('.btn-p2').addEventListener("click", function(){
//     document.querySelector("#text-p1").textContent = document.querySelector('.p2-name').value;
//     player2Name = document.querySelector('.p2-name').value;
//     console.log(`Player 2 name changed to ${document.querySelector('.p2-name').value}`);
// });

// document.querySelector(".btn-max").addEventListener("click", function(){
//    winningScore = document.querySelector(".max-score").value;
//     console.log(`Max score changed to ${winningScore}`);
// });

document.querySelector(".btn-roll").addEventListener('click', function() {
    var dice = Math.floor((Math.random()*5)+1);
    diceDom = document.querySelector('.dice');
    diceDom.src = "/images/dice" + dice + ".png";
    console.log(dice);
    if(dice != 1) {
        console.log('player turn is' + playerTurn + 'upating curr-score roundscore');
        roundScore += dice;
        document.getElementById("curr-score"+playerTurn).textContent = roundScore;
        var query = parseQuery(window.location.search);
        console.log(query.id);
        socket.emit('requestTurnScore', {
            roundScore,
            playerTurn,
            id:query.id
        });
    }
    else {
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
    socket.emit('requestNew', {
       id:query.id
    });
    if(playerTurn == 1) {
        nextPlayer();
    }
});

function checkTurn() {
    if(playerTurn === 0) {
        console.log('0');
        socket.emit('requestHostTurn', {
            id: query.id,
            turn: playerTurn
        });
    } else if(playerTurn === 1) {
        console.log('1');
        socket.emit('requestPairTurn', {
            id: query.id,
            turn:playerTurn
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
    document.querySelector("#curr-score" + playerTurn).textContent = 0;
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
    // playerTurn === 0 ? playerTurn = 1 : playerTurn = 0;
    checkTurn();
    switchColor();
}



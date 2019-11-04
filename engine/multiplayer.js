let scores = [0, 0];
let playerTurn = 0;
let roundScore = 0;
let winningScore = 100;
let player1Name = "player 1";
let player2Name = "player 2";
let query = parseQuery(window.location.search);

document.querySelector(".btn-roll").addEventListener('click', function () {
    let dice = Math.floor((Math.random() * 6) + 1);
    diceDom = document.querySelector('#dice');
    diceDom.src = "../views/images/dice" + dice + ".png";
    if (dice != 1) {
        roundScore += dice;
        let query = parseQuery(window.location.search);
        socket.emit('requestTurnScore', {
            roundScore,
            playerTurn,
            id: query.id,
            dice
        });
    }
    else {
        let query = parseQuery(window.location.search);
        socket.emit('diceOneRequest', {
            id: query.id
        })
        socket.emit('zeroRequest', {
            turn: playerTurn,
            id: query.id
        });
        nextPlayer();
    }
});

document.querySelector(".btn-hold").addEventListener('click', function () {
    scores[playerTurn] += roundScore;
    let query = parseQuery(window.location.search);
    socket.emit('requestHold', {
        playerTurn,
        id: query.id,
        scores
    });
    if (scores[playerTurn] >= winningScore) {
        socket.emit('playerWinRequest', {
            name: document.getElementById('text-p' + playerTurn).innerHTML,
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

document.getElementById('btn-start').addEventListener('click', function () {
    socket.emit('hostTurnRequestFirst', { id: query.id });
});

document.querySelector(".btn-new").addEventListener("click", function () {
    roundScore = 0;
    scores = [0, 0];
    let query = parseQuery(window.location.search);
    if (playerTurn == 1) {
        nextPlayer();
    }
    socket.emit('requestNew', {
        id: query.id
    });
});

checkTurn = () => {
    let hostName = document.getElementById('text-p0').innerHTML;
    let pairName = document.getElementById('text-p1').innerHTML;
    if (playerTurn === 0) {
        socket.emit('requestHostTurn', {
            id: query.id,
            turn: playerTurn,
            hostName
        });
    } else if (playerTurn === 1) {
        socket.emit('requestPairTurn', {
            id: query.id,
            turn: playerTurn,
            pairName
        });
    }
};

switchColor = () => {
    socket.emit('switchcolor', {
        id: query.id
    });
}

nextPlayer = () => {
    roundScore = 0;
    let query = parseQuery(window.location.search);
    if (playerTurn === 0) {
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
};



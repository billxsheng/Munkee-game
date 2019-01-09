var scores = [0, 0];
var playerTurn = 0;
var currentScore1 = 0;
var currentScore2 = 0;
var roundScore = 0;
var winningScore = 100;
var player1Name = "player 1"
var player2Name = "player 2"

document.querySelector('.btn-p1').addEventListener("click", function () {
    document.querySelector("#text-p0").textContent = document.querySelector('.p1-name').value;
    player1Name = document.querySelector('.p1-name').value;
    console.log(`Player 1 name changed to ${document.querySelector('.p1-name').value}`);
});

document.querySelector('.btn-p2').addEventListener("click", function () {
    document.querySelector("#text-p1").textContent = document.querySelector('.p2-name').value;
    player2Name = document.querySelector('.p2-name').value;
    console.log(`Player 2 name changed to ${document.querySelector('.p2-name').value}`);
});

document.querySelector(".btn-max").addEventListener("click", function () {
    winningScore = document.querySelector(".max-score").value;
    console.log(`Max score changed to ${winningScore}`);
});

document.getElementById("score0").textContent = 0;
document.getElementById("score1").textContent = 0;
document.getElementById("curr-score0").textContent = 0;
document.getElementById("curr-score1").textContent = 0;

document.querySelector("#btn-roll").addEventListener('click', function () {
    var dice = Math.floor((Math.random() * 6) + 1);
    diceDom = document.querySelector('.dice');
    diceDom.src = "images/dice" + dice + ".png";
    console.log(dice);
    if (dice !== 1) {
        roundScore += dice;
        document.getElementById("curr-score" + playerTurn).textContent = roundScore;
    }
    else {
        nextPlayer();
    }
});

document.querySelector("#btn-hold").addEventListener('click', function () {
    scores[playerTurn] += roundScore;
    document.querySelector("#score" + playerTurn).textContent = scores[playerTurn];

    if (scores[playerTurn] >= winningScore) {
        document.querySelector("#text-p" + playerTurn).textContent = "winner!";
        document.querySelector("#btn-hold").classList.add("disabled");
        document.querySelector("#btn-roll").classList.add("disabled");
    } else {
        nextPlayer();
        console.log(playerTurn);
    }


});

document.querySelector("#btn-new").addEventListener("click", function () {
    console.log(1);
    roundScore = 0;
    scores = [0, 0];
    document.querySelector("#btn-hold").classList.remove("disabled");
    document.querySelector("#btn-roll").classList.remove("disabled");
    document.getElementById("text-p0").textContent = player1Name;
    document.getElementById("text-p1").textContent = player2Name;
    document.getElementById("score0").textContent = 0;
    document.getElementById("score1").textContent = 0;
    document.getElementById("curr-score0").textContent = 0;
    document.getElementById("curr-score1").textContent = 0;
    if (playerTurn == 1) {
        nextPlayer();
        console.log(playerTurn);
    }
});


function nextPlayer() {
    roundScore = 0;
    document.querySelector("#curr-score" + playerTurn).textContent = 0;
    playerTurn === 0 ? playerTurn = 1 : playerTurn = 0;
    console.log(playerTurn);
    document.querySelector("#text-p0").classList.toggle("act");
    document.querySelector("#text-p1").classList.toggle("act");
    document.querySelector("#score0").classList.toggle("act2");
    document.querySelector("#score1").classList.toggle("act2");
    document.querySelector("#curr-score0").classList.toggle("act3");
    document.querySelector("#curr-score1").classList.toggle("act3");
}



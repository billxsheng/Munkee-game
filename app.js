var scores = [0,0];
var playerTurn = 0;
var currentScore1 = 0;
var currentScore2 = 0;
var roundScore = 0;

document.getElementById("score0").textContent = 0;
document.getElementById("score1").textContent = 0;
document.getElementById("curr-score0").textContent = 0;
document.getElementById("curr-score1").textContent = 0;




document.querySelector(".btn-roll").addEventListener('click', function() {
    var dice = Math.floor((Math.random()*5)+1);
    diceDom = document.querySelector('.dice');
    diceDom.src = "images/dice" + dice + ".png";
    
    if(dice !== 1) {
        roundScore += dice;
        document.getElementById("curr-score"+playerTurn).textContent = roundScore;
    }
    else {
        nextPlayer();
    }
});

document.querySelector(".btn-hold").addEventListener('click', function() {
    scores[playerTurn] += roundScore;
    document.querySelector("#score" + playerTurn).textContent = scores[playerTurn];

   
   if(scores[playerTurn] >= 10) {
       document.querySelector("#text-p" + playerTurn).textContent = "winner!";
       document.querySelector(".btn-hold").classList.add("disabled");
       document.querySelector(".btn-roll").classList.add("disabled");
    } else {
        nextPlayer();
    }
    
    
});

document.querySelector(".btn-new").addEventListener("click", function() {
   scores = [0,0];
    document.querySelector("#text-p0").textContent = "player 1";
    document.querySelector("#text-p1").textContent = "player 2";
    document.getElementById("score0").textContent = 0;
    document.getElementById("score1").textContent = 0;
    document.getElementById("curr-score0").textContent = 0;
    document.getElementById("curr-score1").textContent = 0;
    if(playerTurn == 1) {
        nextPlayer();
    }
    
   
});


function nextPlayer() {
    roundScore = 0;
    document.querySelector("#curr-score" + playerTurn).textContent = 0;
    playerTurn === 0 ? playerTurn = 1 : playerTurn = 0;
    document.querySelector("#text-p0").classList.toggle("act");
    document.querySelector("#text-p1").classList.toggle("act");
    document.querySelector("#score0").classList.toggle("act2");
    document.querySelector("#score1").classList.toggle("act2");
    document.querySelector("#curr-score0").classList.toggle("act3");
    document.querySelector("#curr-score1").classList.toggle("act3");
}



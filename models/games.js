var mongoose = require('mongoose');


var gameSchema = mongoose.Schema({
    gameId: String,
    host: String,
    pair: String
});


var Game = mongoose.model('Game', gameSchema);

module.exports = {Game};
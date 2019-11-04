let mongoose = require('mongoose');

let gameSchema = mongoose.Schema({
    gameId: String,
    host: String,
    pair: String
});

let Game = mongoose.model('Game', gameSchema);

module.exports = {Game};
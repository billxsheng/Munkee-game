var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/munkee', function(e) {
    console.log('e');
});

module.exports = {mongoose};

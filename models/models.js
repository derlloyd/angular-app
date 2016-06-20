var mongoose = require('mongoose');

// schema for user documents into the db collection
var userSchema = new mongoose.Schema({
    username: String,
    password: String, //hash created from password
    created_at: {type: Date, default: Date.now}
});


// schema for etf documents into the db collection
var etfSchema = mongoose.Schema({
    name: {type: String, required: true},
    ticker: {type: String, required: true},
    username: String,  // { type: Schema.ObjectId, ref: 'User' } ref a user document in user collection
    created_at: {type: Date, default: Date.now},
});

// declare models and their schemas
mongoose.model('Etf', etfSchema);
mongoose.model('User', userSchema);
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Etf = mongoose.model('Etf');

module.exports = function(passport){
    // must call the done callback function on every exit point of the function
    
    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    // need to be provided a unique ID for each user
    passport.serializeUser(function(user, done) {
        // tell passport which id to user for user
        console.log('serializing user:', user._id);
        // return users unique id
        return done(null, user._id);
    });
    
    // get user info out of the session
    passport.deserializeUser(function(id, done) {
        
        User.findById(id, function(err, user) {
           if (err) {
               return done(err, false);
           }
           if (!user) {
               return done('user not found', false);
           }
           
           // user found, return user obj back to passport
           return done(user, true);
        });
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            // first try to find the username
            User.findOne({'username': username}, function(err, user) {
               if (err) {
                   // db error
                   return done(err, false);
               };
               
            console.log("in login, find ", username);
               if (!user) {
                   // there's no user with this username
                   console.log('user ' +  username + ' not found!');
                   return done(null, false);
               };
               
               if (!isValidPassword(username, password)) {
                   // password is not correct
                   console.log('incorrect password');
                   return done(null, false);
               };
               
               // user found, password good, login in user
               return done(null, user)
                
            });
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // first check if the user exists
            User.findOne({'username': username}, function(err, user) {
                if (err) {
                    // db error
                    console.log('Error in SignUp: ' + err);
                    return done(err, false)
                };
                
                if (user) {
                    // user already signed up
                    console.log('User already exists with username: ' + username);
                    return done(null, false);
                };
                
                // no error, not duplicate, now save new user
                var newUser = new User();
                // set credentials
                newUser.username = username;
                newUser.password = createHash(password);
                
                newUser.save(function(err) {
                    if (err) {
                        // db error
                        return done(err, false);
                    }
                    console.log('successfully signed up user '+ username);
                    // first param is error, no error is null, return user object
                    return done(null, newUser)
                })
            });
        })
    );
    // hashed password comparison
    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
};
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
//temporary data store + will soon be mongodb
var users = {};






module.exports = function(passport){
    // must call the done callback function on every exit point of the function
    
    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    // need to be provided a unique ID for each user, use user.username for now
    passport.serializeUser(function(user, done) {
        // tell passport which id to user for user
        console.log('serializing user:',user.username);
        return done(null, user.username);
    });
    
    // get user info out of the session
    passport.deserializeUser(function(username, done) {
        // returns user object back
        return done(null, users[username]);
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            
            // does user exist?
            if (!users[username]) {
                return done('user not found', false)
            };
            
            // is password correct?
            if (!isValidPassword(users[username], password)) {
                return done('invalid password', false)
            };
            
            // successfully signed in
            console.log(users[username].username + 'successfully signed in');
            return done(null, users[username]);
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            // check if the user exists
            if (users[username]) {
                return done('username already taken', false);
            };
            
            // add user to db
            users[username] = {
                username: username,
                password: createHash(password)
            };
            
            // first param is error, no error is null, return user object
            return done(null, users[username]);

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
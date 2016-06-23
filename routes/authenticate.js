var express = require('express');
var router = express.Router();

module.exports = function(passport) {
    // need to allows cors for /auth routes
    router.use(function(req, res, next) {
        // send this back with the result to enable cross origin ressource sharing
        // for now, this allows everyone "*", but could specify my page "https://access-api-demo2-derlloyd.c9users.io"
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
        next()
    });

    // sends successful login state back to angular or other app
    router.get('/success', function(req, res, user) {
        res.send({
            state: 'success',
            user: req.user ? req.user : null
        });
    });

    // sends failure login state back to angular or other app
    router.get('/failure', function(req, res) {
        res.send({
            state: 'failure',
            user: null,
            message: "Invalid username or password"
        });
    });

    // log in
    // router.post('/login', passport.authenticate('login', {
    //     successRedirect: '/auth/success',
    //     failureRedirect: '/auth/failure'
    // }));

    // // sign up
    // router.post('/signup', passport.authenticate('signup', {
    //     successRedirect: '/auth/success',
    //     failureRedirect: '/auth/failure'
    // }));

    // // log in
    router.post('/login', function handleLocalAuth(req, res, next) {

        passport.authenticate('login',
            function(err, user, info) {
                if (err) {
                    res.json({
                        state: 'failure',
                        user: null,
                        message: err
                    });
                };

                if (!user) {
                    res.json({
                        state: 'failure',
                        user: null,
                        message: "Invalid username or password"
                    });
                };
            
                // Manually establish the session...
                req.login(user, function(err) {
                    if (err) {
                        res.json({
                            state: 'failure',
                            user: null,
                            message: "Unable to login"
                        })
                    };
                    
                    // successful login
                    // get token from jwt
                    
                    res.json({
                            state: 'success',
                            user: user,
                            token: "logintoken123",
                            message: "user authenticated"
                        })
                    
                    return
                });
            }
        )(req, res, next)
    });

    // sign up
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    // log out
    router.get('/signout', function(req, res) {
        // console.log('logout and redirect to /')
        req.logout();
        // redirect is done in angular app
        res.send({
            state: 'success',
            message: "User logged out"
        });
    });

    return router;

}
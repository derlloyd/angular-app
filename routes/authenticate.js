var express = require('express');
var router = express.Router();

// to verify tokens
var jwt = require('jsonwebtoken');

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

    // log in
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
            
                // Log user in
                req.login(user, function(err) {
                    if (err) {
                        res.json({
                            state: 'failure',
                            user: null,
                            message: "Unable to login"
                        })
                    };
                    // successful login
                    // if user is found and password is right, create a token
                    var token = jwt.sign(user, 'privateKey');
                    
                    res.cookie('TOKEN', token);
                    // also included token in response
                    res.json({
                            state: 'success',
                            user: user,
                            token: token,
                            message: "user authenticated"
                        })
                    
                    return
                });
            }
        )(req, res, next)
    });

    // sign up
    router.post('/signup', function handleLocalAuth(req, res, next) {
    
        passport.authenticate('signup',
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
                        message: "Error creating user"
                    });
                };
                
                // Log user in
                req.login(user, function(err) {
                    if (err) {
                        res.json({
                            state: 'failure',
                            user: null,
                            message: "Unable to login"
                        })
                    };
                    // successful login
                    // if user is found and password is right, create a token
                    var token = jwt.sign(user, 'privateKey');
                    
                    res.cookie('TOKEN', token);
                    // also included token in response
                    res.json({
                            state: 'success',
                            user: user,
                            token: token,
                            message: "user authenticated"
                        })
                    return
                });
            })(req, res, next)
    });
    
    // log out
    router.get('/signout', function(req, res) {
        // console.log('logout and redirect to /')
        req.logout();
        res.clearCookie('TOKEN');
        // redirect is done in angular app
        res.send({
            state: 'success',
            message: "User logged out"
        });
    });
    
    // this is only called if token cookie exists
    router.get('/getuser/:token*?', function(req, res) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
        // get user object from token
        var token = req.query.token || req.cookies.TOKEN;
        
        var result = jwt.verify(token, 'privateKey');
        
        if (result) {
            res.json({
                    state: 'success',
                    user: result._doc,
                    message: 'user info retrieved'
                });
            
        } else {
            res.json({
                    state: 'failure',
                    token: token,
                    err: result,
                    message: 'unable to get user'
                });
        } 
    });
    
    return router;

}
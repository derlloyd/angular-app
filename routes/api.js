var express = require('express');
var router = express.Router();
// to verify tokens
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose');
var Etf = mongoose.model('Etf');
var User = mongoose.model('User');

// api route middleware
router.use(function(req, res, next) {
    // send this back with the result to enable cross origin ressource sharing
    // for now, this allows everyone "*", but could specify my page "https://access-api-demo2-derlloyd.c9users.io"
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");

    if (req.isAuthenticated()) {
        // user authenticated - from passport
        return next();
    }

    // check params or url query or cookies for token
    var token = req.params.token || req.query.token || req.cookies.TOKEN || "none";
    
    if (token !== "none") {
        // token exists, not equal to none)
        
        var result = jwt.verify(token, 'privateKey');
        
        // attach user to req, pass to next
        req.user = result._doc;
        next();

    } else {
        // there is no token, equal to none
        // return an error, 403 forbidden, not allowed to view data
        return res.status(403).json({
            state: 'failure',
            message: "in verify! User not logged in"
        });
    }
});

router.route('/users')

// show all users
.get(function(req, res) {

    User.find(function(err, users) {
        if (err) {
            return res.status(500).json({
                state: 'failure',
                message: 'Error retrieving users'
            });
        }
        res.json(users);
    })
});


router.route('/etfs')

// show all etfs
.get(function(req, res) {

    // can add optional limit after callback
    Etf.find(function(err, etfs) {
        if (err) {
            return res.status(500).json({
                state: 'failure',
                message: 'Error retrieving ETFs'
            });
        }
        res.json(etfs);
    })
})

// create new
.post(function(req, res) {

    // get info from body
    var etf = req.body;
    // validate data
    if (!etf.name || !etf.ticker) {
        return res.status(400).json({
            state: 'failure',
            message: 'Name and Ticker Required'
        });
    };

    // all good, add docuument
    Etf.create(etf, function(err, etf) {
        if (err) {
            return res.status(500).json({
                state: 'failure',
                message: 'Error creating ETF'
            });
        };

        res.json({
            state: 'success',
            message: 'ETF created.',
            etf: etf
        });
    })
});


router.route('/etfs/:id')

// return one etf
.get(function(req, res) {
    // get requested id
    var id = {
        _id: req.params.id
    };

    Etf.findOne(id, function(err, etf) {
        if (err) {
            return res.status(500).json({
                state: 'failure',
                message: 'Error retrieving ETF'
            });
        };
        // return result of query
        res.json(etf);
    });
})

//update one
.put(function(req, res) {
    // get requested id
    var id = {
        _id: req.params.id
    };
    // body contains updated info
    var etf = req.body;

    Etf.update(id, {
        '$set': etf
    }, function(err, etf) {
        if (err) {
            return res.status(500).json({
                state: 'failure',
                message: 'Error updating ETF'
            });
        };
        // return success message
        res.json({
            state: 'success',
            message: 'ETF updated'
        });
    });
})

// delete one
.delete(function(req, res) {
    // get requested id
    var id = {
        _id: req.params.id
    };

    Etf.remove(id, function(err) {
        if (err) {
            return res.json({
                state: 'failure',
                err: err
            })
        };
        // return success message
        res.json({
            state: 'success',
            message: 'ETF deleted'
        });
    });
});

module.exports = router;

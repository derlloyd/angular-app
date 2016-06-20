var express = require('express');
var router = express.Router();

// api route middleware
router.use(function(req, res, next) {
    
    // anyone can use GET method, only auth users can POST, PUT, DELETE
    if (req.method === "GET") {
        // for any GET continue to next middleware
        return next();
    }
    if (!req.isAuthenticated()) {
        // user not authenticated, redirect to login page
        console.log('not logged in, redirect to login');
        return res.send('not logged in, redirect to login');
        // res.redirect('/#login');
    }
    // user authenticated, continue to next middleware
    return next();
});

// api for all etfs
router.route('/etfs')
    // show all etfs
    .get(function(req, res) {
        res.send({message: "TODO return all"})
    })
    
    // create new
    .post(function(req, res) {
        res.send({message: "TODO create new etf"})
    });
    

//api for a specfic etf
router.route('/etfs/:id')
    // returns one etf
    .get(function(req,res){
        return res.send({message:'TODO get an existing post by using param ' + req.params.id});
    })

    //update
    .put(function(req,res){
        return res.send({message:'TODO modify an existing post by using param ' + req.params.id});
    })

    .delete(function(req,res){
        return res.send({message:'TODO delete an existing post by using param ' + req.params.id})
    });






/*

// ------------------------------PRIVATE API ROUTE MIDDLEWARE--------------------------------------
// ------------------------------------------------------------------------------------------------

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret
    jwt.verify(token, app.get('mySecret'), function(err, decoded) {      
      if (err) {
        return res.status(400).json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error, 403 forbidden, not allowed to view data
    return res.status(403).json({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});

// ------------------------------PRIVATE API ROUTE HANDLERS--------------------------------------
// ----------------------------------------------------------------------------------------------


// ------------------------------USERS--------------------------------------

// route to return all users (GET /api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    if (err) throw err;
    // there will always be at least 1 user
    return res.status(200).json(users);
  });
});

// ------------------------------ETFS--------------------------------------

// Show all ETFS (GET /api/etfs)
apiRoutes.get('/etfs', function(req, res) {
  // can add optional limit after callback
  Etf.getEtfs(function(err, etfs) {
    if (err) {
      return res.status(500).json({success: false, message: 'Error retrieving ETFs'});
    }
    res.status(200).json(etfs);
  })
})

// Show one ETF (GET /api/etfs/:id)
apiRoutes.get('/etfs/:id', function(req, res) {
  var id = {
    _id: req.params.id
  };
  // res.json(id) // why not working **********************************
  
  Etf.getEtf(id, function(err, etf) {
    if (err) {
      return res.status(500).json({success: false, message: 'Error retrieving ETF'});
    }
    res.status(200).json(etf);
  })
});

// ADD an ETF (POST /api/etfs)
apiRoutes.post('/etfs', function(req, res) {
  var etf = req.body;
  // validate data
  if (!etf.name || !etf.ticker) {
    return res.status(400).json({success: false, message: 'Name and Ticker Required'});
  }
  Etf.addEtf(etf, function(err, etf) {
    if (err) {
      return res.status(500).json({success: false, message: 'Error creating ETF'});
    }
    res.status(200).json({
      success: true,
      message: 'ETF created.',
      etf: etf
    });
  })
})

// UPDATE an ETF (PUT /api/etfs/:id)
apiRoutes.put('/etfs/:id', function(req, res) {
  // body contains updated info
  var etf = req.body;
  delete etf._id // if it is in the body
  var id = {
    _id: req.params.id
  };

  Etf.updateEtf(id, etf, function(err, etf) {
    if (err) {
      return res.status(500).json({success: false, message: 'Error updating ETF'});
    }
    return res.status(200).json({success: true, message: 'ETF updated'});
  })
});

// DELETE an ETF (DELETE /api/etfs/:id)
apiRoutes.delete('/etfs/:id', function(req, res) {
  var id = req.params.id;
  Etf.deleteEtf(id, function(err, deleted) {
    if (err) {
      return res.status(500).json({success: false, message: 'Error deleting ETF'});
    }
    return res.status(200).json({success: true, message: 'ETF deleted'});
  })
});

// ------------------------------ADVISORS--------------------------------------

// Show all advisors (GET /api/advisors)
apiRoutes.get('/advisors', function(req, res) {
  Advisor.getAdvisors(function(err, advisors) {
    if (err) {
      return res.status(500).json({success: false, message: 'Error retrieving advisors'});
    }
    res.status(200).json(advisors);
  })
})

// Show one Advisor (GET /api/advisors/:id)
apiRoutes.get('/advisors/:id', function(req, res) {
  // body contains updated info
  var advisor = req.body;
  var id = req.params.id;
  Etf.updateAdvisor(id, advisor, function(err, advisor) {
    if (err) {
      return res.status(500).json({success: false, message: 'Error updating advisor'});
    }
    res.status(200).json(advisor);
  })
});

// ADD an advisor (POST /api/advisors)
apiRoutes.post('/advisors', function(req, res) {
  var advisor = req.body;
  if (!advisor.name || !advisor.firm) {
    return res.status(400).json({success: false, message: 'Advisor Name and Firm Required'});
  }
  Advisor.addAdvisor(advisor, function(err, advisor) {
    if (err) {
      return res.status(500).json({success: false, message: 'Error creating advisor'});
    }
    res.status(200).json({
      success: true,
      message: 'Advisor created',
      advisor: advisor
    });
  })
})

// UPDATE an Advisor (PUT /api/advisors/:id)
apiRoutes.put('/advisors/:id', function(req, res) {
  // body contains updated info
  var advisor = req.body;
  var id = req.params.id;
  Etf.updateAdvisor(id, advisor, function(err, advisor) {
    if (err) {
      return res.status(500).json({success: false, message: 'Error updating advisor'});
    }
    return res.status(200).json({success: true, message: 'Advisor updated'});
  })
});

// DELETE an Advisor (DELETE /api/advisors/:id)
apiRoutes.delete('/advisors/:id', function(req, res) {
  var id = req.params.id;
  Etf.deleteAdvisor(id, function(err, deleted) {
    if (err) {
      return res.status(500).json({success: false, message: 'Error deleting advisor'});
    }
    return res.status(200).json({success: true, message: 'Advisor deleted'});
  })
});

// apply the routes with the prefix /api
app.use('/api', apiRoutes);



*/


module.exports = router;


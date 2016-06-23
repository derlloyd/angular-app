/* global angular */

var app = angular.module('myApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http) {
    // changes to rootscope here
    // is user logged in? default is no
    $rootScope.authenticated = false;
    $rootScope.current_user = 'Guest';
    
    // store logout function in the root so it can be accessed anywhere
    $rootScope.logout = function() {
        $http.get('/auth/signout');
        
        $rootScope.authenticated = false;
        $rootScope.current_user = 'Guest';
        
        $http.get('/')
    };
});

// wire up templates and controllers depending on the browser's location
app.config(function($routeProvider) {
    $routeProvider
        // the list of etfs display
        .when('/', {
            templateUrl: 'main.html',
            controller: 'mainController'
        })
        // the login display
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'authController'
        })
        // the signup display
        .when('/signup', {
            templateUrl: 'signup.html',
            controller: 'authController'
        });
});

app.factory('etfService', function($resource) {
    // this handles all api routing
    return $resource('api/etfs/:id');
});

app.controller('mainController', function($scope, $rootScope, etfService) {
    // defines business logic
    // $scope is passed around to views
    // clear the form
    $scope.newEtf = "";
    // refresh the query to get all etfs to list
    $scope.etfs = etfService.query();
    
    $scope.post = function() {
        // post is called from form on main.html
        // create document to be saved
        var etf = {
            created_by: $rootScope.current_user, 
            created_at: Date.now(),
            ticker: $scope.newEtf.ticker,
            name: $scope.newEtf.name
        };
        // save document
        etfService.save(etf, function() {
            // after saved, clear the form
            $scope.newEtf = "";
            // refresh the query to add new etf to list
            $scope.etfs = etfService.query();
        });
    };
});

// $http is a core angular service
// use $http.get('/url').success(successCallback) - get, post, head, put, delete any method
// save auth in $rootScope
// $location to redirect
app.controller('authController', function($scope, $rootScope, $http, $location) {
    $scope.user = {
        username: '',
        password: ''
    };
    $scope.error_message = '';

    $scope.login = function() {
        $http.post('/auth/login', $scope.user).success(function(data) {
            // result of success {state: 'success', user: req.user ? req.user : null}
            // result of fail {state: 'failure', user: null, message: "Invalid username or password"}
            
            if (data.state === 'success') {
                // success function when user logged in
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                // redirect to root when logged in, also changes view
                $location.path('/')
            } else {
                // displayed over login
                $scope.error_message = data.message;
            };
        });
    };

    $scope.register = function() {
        $http.post('/auth/signup', $scope.user).success(function(data) {
            // result of success {state: 'success', user: req.user ? req.user : null}
            // result of fail {state: 'failure', user: null, message: "Invalid username or password"}
            
            if (data.state === 'success') {
                // success function when user logged in
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                
                // redirect to root when logged in, also changes view
                $location.path('/')
            } else {
                // displayed over login
                $scope.error_message = data.message;
            }
        });
    };
});
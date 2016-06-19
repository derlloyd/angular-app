var app = angular.module('myApp', []);
// dependencies go in []

app.controller('mainController', function($scope) {
    // defines business logic
    // $scope is passed arond to views
    $scope.etfs = [];
    $scope.newEtf = {created_by: '', ticker: '', name: '', created_at: ''};
    
    $scope.post = function() {
        $scope.newEtf.created_at = Date.now();
        $scope.etfs.push($scope.newEtf);
        $scope.newEtf = {created_by: '', ticker: '', name: '', created_at: ''};
    };
});

app.controller('authController', function($scope) {
    $scope.user = {username: '', password: ''};
    $scope.error_message = '';
    
  $scope.login = function(){
    //placeholder until authentication is implemented
    $scope.error_message = 'login request for ' + $scope.user.username;
  };

  $scope.register = function(){
    //placeholder until authentication is implemented
    $scope.error_message = 'registeration request for ' + $scope.user.username;
  };
});
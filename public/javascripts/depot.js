var app = angular.module('dep', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('/', {
      url: "/", 
      template: "<h1>INDEX(partial)</h1>"
    })
    .state('login',{
      url: "/login",
      templateUrl: '/login'
    })
});

app.controller('depCon', function($scope, $http, $q, $timeout){
//  $scope.user = user;
  $scope.showLoading = false;
  $scope.user = "";

  $scope.searchItems = function(name){
    $scope.showLoading = true
    $http.get('items/' + name).success(function(result){
      $scope.searchResult = result.item
      $scope.showLoading = false
    }).error(function(result){
      console.log("ERROR:" + result)
    });
  }

  $scope.getProps = function(id){
    if($scope.user){
      $http.get('prop/' + $scope.user.id).success(function(result){
        $scope.props = result;
      });
    }
  }

  $scope.clickItem = function(content){
    $http.post('prop/', content).success(function(result){
      $scope.getProps();
    });
  }

  // TODO CORS problem
  $scope.facebookLogin = function(){
    $http.get('auth/facebook').success(function(result){
      console.log("FBSUCS");
    });
  }

  $scope.logout = function(){
    $http.get('auth/logout').success(function(result){
      $scope.user = "";
      $scope.searchResult = "";
    });
  }

  var checkLoggedin = function(){
    var deferred = $q.defer();
    // TODO showloading
    $http.get('/auth/loggedin').success(function(user){
      if(user != 0){
        $scope.user = user;
        // TODO what is this?
        console.log("ENTER");
        $scope.getProps();
        $timeout(deferred.resolve, 0);
      }else{
        $timeout(function(){
          deferred.reject();
        }, 0);
      }
    });
    return deferred.promise;
  };
  checkLoggedin();
});

var app = angular.module('dep', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('/', {
      url: "/", 
      template: "<h1>VIEWAAA</h1>"
    })
    .state('login',{
      url: "/login",
      templateUrl: '/login'
    })
});

app.controller('depCon', function($scope, $http, $q, $timeout){
//  $scope.user = user;
  $scope.showLoading = false

  $scope.searchItems = function(name){
    $scope.showLoading = true
    $http.get('items/' + name).success(function(result){
      console.log("http succeed")
      $scope.contents = result.item
      $scope.showLoading = false
    }).error(function(result){
      console.log("ERROR:" + result)
    });
  }

  $scope.getProps = function(id){
    $http.get('prop/').success(function(result){
      $scope.props = result;
    });
  }

  $scope.clickItem = function(content){
    $http.post('prop/', content).success(function(result){
      console.log("post succeed");
      $scope.getProps();
    });
  }

  var checkLoggedin = function(){
    var deferred = $q.defer();
    $http.get('/auth/loggedin').success(function(user){
      if(user != 0){
        $scope.user = user;
        console.log("LOGGEDIN");
        $timeout(deferred.resolve, 0);
      }else{
        console.log("NOT LOGIN");
        $timeout(function(){
          deferred.reject();
        }, 0);
      }
    });
    return deferred.promise;
  };
  checkLoggedin();

});

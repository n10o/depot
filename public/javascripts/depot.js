var app = angular.module('dep', ['ui.router', 'ui.bootstrap']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('watch', {
      url: "/",
      templateUrl: "watch"
    })
    // .state('detail', {
    //   url: "/item/:id",
    //   templateUrl: function($stateParams){
    //     return 'item/' + $stateParams.id;
    //   }
    // })
    .state('detail', {
      url: "/item/:id",
      templateUrl: "detail.html",
      controller: function($stateParams, $scope, $http){
        var getItem = function(){
          $http.get('prop/item/' + $stateParams.id).success(function(result){
            $scope.item = result[0];
          });
        }
        getItem();
      }
    })
    .state('login',{
      url: "/login",
      templateUrl: 'login'
    })
    .state('search', {
      url: "/search",
      templateUrl: 'search'
    })
});

app.controller('depCon', function($scope, $http, $q, $timeout, $state){
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

  $scope.deleteItem = function(itemID){
    // TODO need AUTH(じゃないと直接api叩けば消せてしまう)
    $http.delete('prop/' + $scope.user.id + '/' + itemID).success(function(result){
      $scope.getProps();
      $state.go("watch");
    });
  };

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

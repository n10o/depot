var app = angular.module('dep', ['ui.router', 'ui.bootstrap', 'xeditable']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('mypage', {
      url: "/",
      templateUrl: 'mypage'
    })
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
  $scope.showLoading = false;
  $scope.user = "";
  $scope.alerts = [];
//  $scope.memo = "";
  $scope.item = [];

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

  $scope.registerItem = function(content){
    $http.post('prop/', content).success(function(result){
      $scope.getProps();
      $scope.addAlert('Success save item', 'success');
    });
  }

  $scope.deleteItem = function(itemID){
    // TODO need AUTH(じゃないと直接api叩けば消せてしまう)
    $http.delete('prop/' + $scope.user.id + '/' + itemID).success(function(result){
      $scope.getProps();
      $state.go("mypage");
    });
  };

  $scope.updateMemo = function(updateItem, memo){
    updateItem["memo"] = memo;
      $http.post('prop/', updateItem).success(function(result){
        $scope.getProps();
        $scope.addAlert('Success update item', 'success');
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

  $scope.addAlert = function(msg, type){
    $scope.alerts.push({type: type, msg: msg});
    $timeout(function(){$scope.closeAlert(0);}, 2000);
  }

  $scope.closeAlert = function(index){
    $scope.alerts.splice(index, 1);
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

var app = angular.module('dep', []);

app.controller('depCon', function($scope, $http){
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

  $scope.getProps();

});

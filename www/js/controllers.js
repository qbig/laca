'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function(
    $rootScope,
    $scope,
    $state,
    $timeout,
    $ionicPlatform,
    $ionicPopup,
    $ionicLoading,
    $cordovaFileTransfer) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  /*
  $ionicPlatform.ready(function() {

    if (window.cordova) {
      var _bg = "http://googledrive.com/host/0B4eZhD1V1_ZAa1RvbGlhYzNYaFk/background.jpg";

      $cordovaFileTransfer.download(_bg, window.cordova.file.dataDirectory + "background.jpg", {}, true)
      .then(function(result) {
      }, function(err) {
        // Error
        $scope.showAlert("Error:" + JSON.stringify(err));
      }, function (progress) {
        /*
        $timeout(function () {
          $scope.downloadProgress = (progress.loaded / progress.total) * 100;
        });
        *
      });
    }
  });*/

  ////////////////////////////////////////////////

  // Alert dialog
  $scope.showAlert = function(message) {
    var alertPopup = $ionicPopup.alert({
     title: 'La Casa Cubana',
     template: message
    });
    alertPopup.then(function(res) {
     //console.log('Thank you!');
    });
  };

  ////////////////////////////////////////////////

  $rootScope.$on('loading:show', function () {
    //class="spinner-positive"
    $ionicLoading.show({template: '<ion-spinner icon="bubbles" class="spinner-stable"></ion-spinner>', noBackdrop: true});
  });

  $rootScope.$on('loading:hide', function () {
    $ionicLoading.hide();
  });

  ////////////////////////////////////////////////

  $scope.onTap = function() {
    $state.go('app.main');
  };

})

//////////////////////////////////////////////////////////////////

.controller('SplashScreenCtrl', function (
  $rootScope,
  $scope,
  $timeout) {
})

//////////////////////////////////////////////////////////////////

.controller('MainCtrl', function (
  $rootScope,
  $scope,
  $timeout,
  $localForage,
  LCCService) {

    $scope.categories = [];

    //////////////////////////////////////////////////////////////////

    $rootScope.$broadcast('loading:show');
    $localForage.getItem('LCCCategories').then(function(localdata) {

        if (localdata === null) {

          LCCService.get('/5e8b3d25').then(function (data) {
            Array.prototype.push.apply($scope.categories, data);
          });

          LCCService.get('/ad67ffe2').then(function (data) {
            Array.prototype.push.apply($scope.categories, data);
          });

          LCCService.get('/ea4b12d2').then(function (data) {
            Array.prototype.push.apply($scope.categories, data);
          });

          LCCService.get('/b01ca536').then(function (data) {
            Array.prototype.push.apply($scope.categories, data);
          });

          LCCService.get('/d7d1f5a7').then(function (data) {
            $rootScope.$broadcast('loading:hide');
            Array.prototype.push.apply($scope.categories, data);
          });

        }else{
          $rootScope.$broadcast('loading:hide');
          $scope.categories = JSON.parse(localdata);
        }
    });

    //////////////////////////////////////////////////////////////////
})

//////////////////////////////////////////////////////////////////

.controller('DetailsCtrl', function (
  $rootScope,
  $scope,
  $stateParams,
  $timeout,
  $localForage,
  LCCService,
  $ionicSlideBoxDelegate) {

    var group = "";
    var stepSlides = 3;

    $scope.slides = [];
    $scope.products = [];
    $scope.category = $stateParams.category;

    $scope.types = {
      "Appertizers": 10,
      "Main": 10,
      "Desserts": 10,
      "default": 10
    };

    //////////////////////////////////////////////////////////////////

    $rootScope.$broadcast('loading:show');

    $timeout(function () {
      $rootScope.$broadcast('loading:hide');
    }, 300);

    //////////////////////////////////////////////////////////////////

    $localForage.getItem('LCCCategories:' + $scope.category).then(function(scdata) {
      if (scdata) {
        $scope.products = JSON.parse(scdata);
        
        for (var i = 0; i < stepSlides; i++) {
          if ($scope.products[i] !== undefined) {
            $scope.slides.push($scope.products[i]);
          }
        }
      }else {

        $localForage.getItem('LCCData').then(function(localdata) {

            if (localdata !== null) {
              var sc = LCCService.filterBySubCategory(JSON.parse(localdata), $scope.category);

              if ($scope.types[$scope.category] !== undefined) {
                sc = LCCService.chunkBy(sc, $scope.types[$scope.category]);
              }else{
                sc = LCCService.chunkBy(sc, $scope.types["default"]);
              }

              $scope.products = sc;

              for (var i = 0; i < stepSlides; i++) {
                if ($scope.products[i] !== undefined) {
                  $scope.slides.push($scope.products[i]);
                }
              }

              $localForage.setItem('LCCCategories:' + $scope.category, JSON.stringify(sc));

            }else{
              $scope.showAlert("Error loading data, try again later");
            }
        });
      }
    });

    //////////////////////////////////////////////////////////////////

    $scope.slideHasChanged = function(index) {

      $timeout(function () {
        var i = $ionicSlideBoxDelegate.slidesCount();

        if (i > $scope.products.length-1) {
          return;
        }

        $scope.slides.push($scope.products[i]);
        $ionicSlideBoxDelegate.update();
      }, 50);

    };

    $scope.checkSubCat = function (subcat) {

      if (group !== subcat) {
        group = subcat;
        return true;
      }
      return false;
    };

    //////////////////////////////////////////////////////////////////

});

// Ionic Starter App

/*
ImgCache.options.debug = false;
ImgCache.options.usePersistentCache = true;
ImgCache.options.chromeQuota = 5*1024*1024; 

ImgCache.init(function() {
    console.log('ImgCache init: success!');
}, function(){
    console.error('ImgCache init: error! Check the log for errors');
});  
*/

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 
  'ngCordova',
  'angular.filter',
  'starter.controllers',
  'starter.directives',
  'starter.services', 
  'LocalForageModule',
  'imagenie'
  ])

.constant('ApiEndpoint', {
  url: 'https://sheetsu.com/apis/'
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(["$stateProvider", "$urlRouterProvider", "$compileProvider", "$sceDelegateProvider", "$ionicConfigProvider", "$httpProvider",
  function($stateProvider, $urlRouterProvider, $compileProvider, $sceDelegateProvider, $ionicConfigProvider, $httpProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.splashscreen', {
    url: '/splashscreen',
    views: {
      'menuContent': {
        templateUrl: 'templates/splashscreen.html',
        controller: 'SplashScreenCtrl'
      }
    }
  })

  .state('app.main', {
    url: '/main',
    views: {
      'menuContent': {
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl'
      }
    }
  })

  .state('app.details', {
    url: '/details/:category',
    views: {
      'menuContent': {
        templateUrl: 'templates/details.html',
        controller: 'DetailsCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/splashscreen');
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|blob|content):|data:image\//);
  
  //$ionicConfigProvider.views.forwardCache(true);
  $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://sheetsu.com/**']);

  //$httpProvider.defaults.useXDomain = true;
  //$httpProvider.defaults.headers.common = 'Content-Type: application/json';
  //delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

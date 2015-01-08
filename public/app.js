angular.module('GoaHack', ['ngResource', 'ngMessages', 'ngRoute', 'ngAnimate',
                           'mgcrea.ngStrap','ngTagsInput','textAngular','truncate'])
  .config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      }) 
    .when('/team/:tslug', {
        templateUrl: 'views/teamDetails.html',
        controller: 'TeamDetailsCtrl'
      })
      .when('/userprofile/edit', {
        templateUrl: 'views/updateProfile.html',
        controller: 'UpdateProfileCtrl'
      })
      .when('/userprofile/:slug', {
        templateUrl: 'views/userProfile.html',
        controller: 'UserProfileCtrl'
      })
      .when('/teams', {
        templateUrl: 'views/teams.html',
        controller: 'TeamsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope, $q, $window, $location) {
      return {
        request: function(config) {
          if ($window.localStorage.token) {
            config.headers.Authorization = $window.localStorage.token;
          }
          return config;
        },
        responseError: function(response) {
          if (response.status === 401 || response.status === 403) {
            $location.path('/login');
          }
          return $q.reject(response);
        }
      }
    });
  });
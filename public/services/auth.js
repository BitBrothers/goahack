angular.module('GoaHack')
  .factory('Auth', function($http, $location, $rootScope, $alert, $window) {
    var token = $window.localStorage.token;
    var user = $window.localStorage.user;
    if (user) {
      $rootScope.currentUser = JSON.parse(user);
    }

    // Asynchronously initialize Facebook SDK
    $window.fbAsyncInit = function() {
      FB.init({
        appId: '779129992098375',
        responseType: 'token',
        version: 'v2.0'
      });
    };

    // Asynchronously load Facebook SDK
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Asynchronously load Google+ SDK
    (function() {
      var po = document.createElement('script');
      po.type = 'text/javascript';
      po.async = true;
      po.src = 'https://apis.google.com/js/client:plusone.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(po, s);
    })();

    return {
      facebookLogin: function() {
        FB.login(function(response) {
          FB.api('/me', function(profile) {
            var data = {
              //accessToken: response.authResponse.signedRequest,
              signedRequest: response.authResponse.signedRequest,
              profile: profile
            };
            $http.post('/api/auth/facebook', data).success(function(data) {
              // var payload = JSON.parse($window.atob(token.split('.')[1]));
              $window.localStorage.token = data.token;
              $window.localStorage.user = JSON.stringify(data.user);
              $rootScope.currentUser = data.user;
              $location.path('/');
              $alert({
                title: 'Cheers!',
                content: 'You have successfully signed-in with Facebook.',
                animation: 'fadeZoomFadeDown',
                type: 'material',
                duration: 3
              });
            });
          });
        }, { scope: 'email, public_profile' });
      },
      googleLogin: function() {
        gapi.auth.authorize({
          client_id: '55262601920-5jhf3qth89okujq6a7lh8bqc9epr8475.apps.googleusercontent.com',
          scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read',
          immediate: false
        }, function(token) {
          gapi.client.load('plus', 'v1', function() {
            var request = gapi.client.plus.people.get({
              userId: 'me'
            });
            request.execute(function(authData) {
              $http.post('/api/auth/google', { profile: authData }).success(function(data) {
                $window.localStorage.token = data.token;
                $window.localStorage.user = JSON.stringify(data.user);
                $rootScope.currentUser = data.user;
                $location.path('/');
                $alert({
                  title: 'Cheers!',
                  content: 'You have successfully signed-in with Google.',
                  animation: 'fadeZoomFadeDown',
                  type: 'material',
                  duration: 3
                });
              });
            });
          });
        });
      },
      login: function(user) {
        return $http.post('/api/auth/login', user)
          .success(function(data) {
            $window.localStorage.token = data.token;
            $window.localStorage.user = JSON.stringify(data.user);
            $rootScope.currentUser = data.user;
            $location.path('/teams');
            $alert({
              title: 'Cheers!',
              content: 'You have successfully logged in.',
              animation: 'fadeZoomFadeDown',
              type: 'material',
              duration: 3
            });
          })
          .error(function() {
            delete $window.localStorage.token;
            $alert({
              title: 'Error!',
              content: 'Invalid username or password.',
              animation: 'fadeZoomFadeDown',
              type: 'material',
              duration: 3
            });
          });
      },
      signup: function(user) {
        return $http.post('/api/auth/signup', user)
          .success(function() {
            $location.path('/login');
            $alert({
              title: 'Congratulations!',
              content: 'Your account has been created.',
              animation: 'fadeZoomFadeDown',
              type: 'material',
              duration: 3
            });
          })
          .error(function(response) {
            $alert({
              title: 'Error!',
              content: response.data,
              animation: 'fadeZoomFadeDown',
              type: 'material',
              duration: 3
            });
          });
      },
      logout: function() {
        delete $window.localStorage.token;
        delete $window.localStorage.user;
        $rootScope.currentUser = null;
        $alert({
          content: 'You have been logged out.',
          animation: 'fadeZoomFadeDown',
          type: 'material',
          duration: 3
        });
      }
    };
  });
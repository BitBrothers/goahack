angular.module('GoaHack')
  .factory('Teams', function($resource) {
    return $resource('/api/event/:eslug/teams');
  });

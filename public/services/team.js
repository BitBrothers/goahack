angular.module('GoaHack')
  .factory('Project', function($resource) {
    return $resource('/api/teams/:_id');
  });

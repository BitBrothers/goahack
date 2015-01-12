angular.module('GoaHack')
  .factory('Progress', function($resource) {
    return $resource('/api/event/goa-hack/status');
  });

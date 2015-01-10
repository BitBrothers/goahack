angular.module('GoaHack')
  .factory('Team', function($resource) {
    return $resource('/api/event/:eslug/team/:tslug', null,
    {
        'update': { method:'PUT' }
    });
  });

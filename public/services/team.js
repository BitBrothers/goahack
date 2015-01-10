angular.module('GoaHack')
  .factory('Team', function($resource) {
  var slug = 'goa-hack';
    return $resource('/api/event/:eslug/team/:tslug',{eslug:"goa-hack"});

  });

var Event = require('../models/Event');
var userController = require('./user');

exports.getEvents = function(req, res, next) {
  var query = Event.find();
  if (req.query.genre) {
    query.where({ genre: req.query.genre });
  } else if (req.query.alphabet) {
    query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
  } else {
    query.limit(12);
  }
  query.exec(function(err, events) {
    if (err) return next(err);
    res.send(events);
  });
};

exports.getEvent = function(req, res, next) {
  Event.findById(req.params.id, function(err, event) {
    if (err) return next(err);
    res.send(event);
  });
};

exports.postEvent = function (req, res, next) {
  var eventName = req.body.eventName
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/[^\w-]+/g, '');
 
    event.save(function (err) {
      if (err) {
        if (err.code == 11000) {
          return res.send(409, { message: event.name + ' already exists.' });
        }
        return next(err);
      }
      res.send(200);
    });
};

exports.postEventRegister = function(req, res, next) {
  Event.findById(req.params.id, function(err, event) {
    if (err) return next(err);
    event.attendees.push(req.user._id);
    event.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  });
};

exports.postEventUnregister = function(req, res, next) {
  Event.findById(req.params.id, function(err, event) {
    if (err) return next(err);
    var index = event.attendees.indexOf(req.user._id);
    event.attendees.splice(index, 1);
    event.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  });
};

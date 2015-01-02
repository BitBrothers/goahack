var Event = require('../models/Event');
var User = require('../models/User');

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

exports.postEvent = function (req, res) {
  var event = new Event();
  event.name = req.body.name;
  event.save(function(err){
    if(err) res.send(err);
    res.json({
      message: 'Event added'
    });
  });
};

exports.postEventRegister = function(req, res, next) {
  Event.findOne({slug:req.params.eslug}, function(err, event) {
    if (err) return next(err);
    event.attendees.push(req.user._id);
    User.findById(req.user._id, function(err, user){
      if(err) res.send(err);
      user.events.push({
                _id: event._id
            });
      user.save(function(err){
        if (err) res.send(err);
      });
    });
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
    User.findById(req.user._id, function(err, user){
      user.events.pull({
        _id:event._id
      });
      user.save(function(err){
        if(err) res.send(err);
      });
    });
    event.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  });
};

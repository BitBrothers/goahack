var Event = require('../models/Event');
var User = require('../models/User');
var Team = require('../models/Team');


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

exports.postEventRegister = function(req, res) {
  Event.findOne({slug:req.params.eslug}, function(err, event) {
    if (err)  res.send(err);
    event.attendees.push(req.user._id);
    User.findById(req.user._id, function(err, user){
      if(err) res.send(err);
      user.events.push({
                _id: event._id,register_status:true
            });

      user.save(function(err){
        if (err) res.send(err);
      });
    });
    event.save(function(err) {
      if (err)  res.send(err);
      res.send(200);
    });
  });
};

exports.postEventUnregister = function(req, res) {
  Event.findOne({slug:req.params.eslug}, function(err, event) {
    if (err) return next(err);
    var index = event.attendees.indexOf(req.user._id);
    event.attendees.splice(index, 1);
    User.findById(req.user._id, function(err, user){
      if(err) res.send(err);
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

exports.getStatus = function(req, res){
  var temp ={
    register_status:false,
    team_status:false,
    ps_status:false,
    member_status:false,
    payment_status:false
  };
  Event.findOne({slug:req.params.eslug},function(err, event){
    if(err) res.send(err);
    else if(!event){
      res.json({
        message: 'Event not found'
      });
    }
    User.findById(req.user._id,function(err, user){
      if(err) res.send(err);
      if(user.events.id(event._id)){

      temp.register_status = user.events.id(event._id).register_status;
      temp.team_status = user.events.id(event._id).team_status;
      temp.payment_status = user.events.id(event._id).payment_status;

      if(user.events.id(event._id).team){
      Team.findById(user.events.id(event._id).team,function(err, team){
        if(err) res.send(err);
        temp.member_status = team.member_status;
        temp.ps_status = team.ps_status;
      });
      }
      }
      res.json(temp);

    });
  });
  
};

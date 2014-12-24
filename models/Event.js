var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var eventSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  tag: [String],
  status: String,
  attendees: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }]
});

var Event = mongoose.model('Event', eventSchema);
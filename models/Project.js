var mongoose = require('mongoose');
var User = require('./User');
var Team = require('./Team');

var projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  tags: [String],
  lastUpdated: String,
  star: Number,
  fork: Number
});

/**
 * Hash the password for security.
 * "Pre" is a Mongoose middleware that executes before each user.save() call.
 */

projectSchema.pre('save', function(next) {
  next();
});

module.exports = mongoose.model('Project', projectSchema);

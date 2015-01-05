var mongoose = require('mongoose');
var User = require('./User');
var Event = require('./Event');
var Project = require('./Project')

var teamSchema = new mongoose.Schema({

  name:  { type: String,unique: true},

  description: String,
  status: {type: String, default:'Un-approved'},
  github: String,
  teamPic: String,
  slug: String,
  tags : [String],
  admin: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },


  members: [{
    _id : {type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
  appliedMembers: [{
    _id : {type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],

  inviteMembers: [{
  _id : {type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],


  problemStatement: {type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  eventSlug: String,
  chat:[{
  	_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  	description: String,
  	date: {type: Date, default: Date.now}
  }]
});


//Slug function
function slugify(text) {

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

teamSchema.index({ 
  name : 'text',
  tags : 'text'
}, {weights:{name:1, tags:1}});
/**
 * Hash the password for security.
 * "Pre" is a Mongoose middleware that executes before each user.save() call.
 */


teamSchema.pre('save', function(next) {
  this.slug = slugify(this.name);
    next();
});

module.exports = mongoose.model('Team', teamSchema);

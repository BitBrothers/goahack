var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Team = require('./Team');
var Event = require('./Event');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  slug: String,
  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  tokens: Array,
  type: String, //Judge,User,Mentor
    
    
  profile: {
    email: {type: String},
    name: { type: String, default: '' },
    nameFull: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    occupation: { type: String, default: '' },
    skills: { type: String, default: '' },
    experience: { type: String, default: '' },
    employers: { type: String, default: '' },
    picture: { type: String, default: '' }
  },
 
  events : [{
    _id : {type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    team : {type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    appliedTeams : [{
      _id : {type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
    }],
    teamInvites : [{
      _id : {type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
    }]
  }],
  
  resetPasswordToken: String,
  resetPasswordExpires: Date
});





//Slug function
function slugify(text) {
console.log(text);
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};


/**
 * Hash the password for security.
 * "Pre" is a Mongoose middleware that executes before each user.save() call.
 */

userSchema.pre('save', function(next) {
  var user = this;
  user.slug = slugify(user.profile.name+Date.now());

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      
       next();
    });
  });


});

/**
 * Validate user's password.
 * Used by Passport-Local Strategy for password validation.
 */

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 * Get URL to a user's gravatar.
 * Used in Navbar and Account Management page.
 */

userSchema.methods.gravatar = function(size) {
  if (!size) size = 200;

  if (!this.email) {
    return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  }

  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('User', userSchema);

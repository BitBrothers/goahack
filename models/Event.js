var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  name:{type : String,unique: true,lowercase:true},
  slug: String,
  tagline: String,
  description: String,
  details: {
    schedule: String
  },
  date: {
  start: Date,
  end: Date
  },
  type: String,
  location: {
    address: String,
    lat: String,
    long: String,
  },
  entry: {
    currency: { type: String, default: 'USD' },
    value: Number
  },
  prizes: [{
    _id:false,
    name: String,
    description: String,
    value: String
  }],
  rules: String,
  city: String,
  judges:[{
    _id:false,
    name: String,
    description: String,
    image: String
  }],
  tags: { type: [String]},
  attendees:{ type: [mongoose.Schema.Types.ObjectId], ref: 'User'},

   teamList: [{
   _id : {type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
   }],

  social:{
    website: String,
    twitter: String,
    facebook: String,
    github: String,
    google: String
  },
  sponsors:[{
    _id:false,
    name:  String,
    title: String,
    image: String,
    description: String
  }],
  resources: String,
  organisers:{ type: [mongoose.Schema.Types.ObjectId], ref: 'User'},
  publish: { type: Boolean, default: false },
});


function slugify(text) {

    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '');         // Trim - from end of text
}



/**
 * Hash the password for security.
 * "Pre" is a Mongoose middleware that executes before each user.save() call.
 */

eventSchema.pre('save', function(next) {
  this.slug = slugify(this.name);
  next();
});

module.exports = mongoose.model('Event', eventSchema);

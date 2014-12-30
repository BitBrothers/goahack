var jwt = require('jwt-simple');
var moment = require('moment');
var crypto = require('crypto');
/**
 * Secret Keys and Configurations.
 */
//TODO Create a config function in secrets.js
//var secret = require('../config/secrets');
//var config = new secret();

var config = require('../config/secrets');

/**
 * Model.
 */
var User = require('../models/User');

var tokenSecret = config.sessionSecret;


function createJwtToken(user) {
  var payload = {
    user: user.profile,
    iat: new Date().getTime(),
    exp: moment().add(7, 'days').valueOf()
  };
  return jwt.encode(payload, tokenSecret);
}

exports.isLogin = function (req, res, next) {
  if (req.headers.authorization) {
    var token = req.headers.authorization.split(' ')[1];
    try {
      var decoded = jwt.decode(token, tokenSecret);
      if (decoded.exp <= Date.now()) {
        res.send(400, 'Access token has expired');
      } else {
        req.user = decoded.user;
        return next();
      }
    } catch (err) {
      return res.send(500, 'Error parsing token');
    }
  } else {
    return res.send(401);
  }
};

exports.signup = function(req, res, next) {
  var user = new User({
    
    email: req.body.email,
    password: req.body.password
  });
  user.profile.email = req.body.email;
  user.profile.name = req.body.name;
  user.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });
};

exports.login = function(req, res, next) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) return res.send(401, 'User does not exist');
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) return res.send(401, 'Invalid email and/or password');
      var token = createJwtToken(user);
      res.send({ token: token });
    });
  });
};

exports.facebookAuth = function(req, res, next) {
  var profile = req.body.profile;
  var signedRequest = req.body.signedRequest;
  var encodedSignature = signedRequest.split('.')[0];
  var payload = signedRequest.split('.')[1];

  var appSecret = 'fc5a36cb1fa441c60b629ee6bc65bc85';

  var expectedSignature = crypto.createHmac('sha256', appSecret).update(payload).digest('base64');
  expectedSignature = expectedSignature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  if (encodedSignature !== expectedSignature) {
    return res.send(400, 'Invalid Request Signature');
  }

  User.findOne({email:profile.email}, function(err, existingUser) {
    if (existingUser) {
      var token = createJwtToken(existingUser);
      return res.send(token);
    }
    var user = new User();
     
      user.email = profile.email;
      user.profile.name = profile.name;
      user.profile.email = profile.email;
    user.save(function(err) {
      if (err) return next(err);
      var token = createJwtToken(user);
      res.send(token);
    });
  });
};

exports.googleAuth = function(req, res, next) {
  var profile = req.body.profile;
 // console.log(req.body.profile);
  User.findOne({email:profile.emails[0].value}, function(err, existingUser) {
    if (existingUser) {
      console.log('heere');
      var token = createJwtToken(existingUser);
       res.send(token);
    }
    var user = new User();
    user.profile.name = profile.displayName;
    user.email= profile.emails[0].value;
    user.profile.email =profile.emails[0].value;
    user.save(function(err) {
      if (err) return next(err);
      var token = createJwtToken(user);
      res.send(token);
    });
  });
};

exports.hasEmail = function(req, res, next) {
  if (!req.query.email) {
    return res.send(400, { message: 'Email parameter is required.' });
  }

  User.findOne({ email: req.query.email }, function(err, user) {
    if (err) return next(err);
    res.send({ available: !user });
  });
};

exports.getUserBySlug = function(req,res){
  User.findOne({slug: req.params.uslug},function(err,user){
    if (err) res.send(err);
    else if(!user){
      res.json({
        message: 'User not found'
      });
    }
    else{
      res.json(user);
    }
  });
};

exports.updateProfile = function(req, res){
  User.findById(req.user._id,function(err, user){
    if(err) res.send(err);

     
    user.profile.name = req.body.name;
    user.profile.nameFull = req.body.nameFull;
    user.profile.location = req.body.location;
    user.profile.website = req.body.website;
    user.profile.occupation = req.body.occupation;
    user.profile.skills = req.body.skills;
    user.profile.experience = req.body.experience;
    user.profile.employers = req.body.employers;
    user.profile.picture = req.body.picture;

    user.save(function(err){
      if (err) res.send(err);
      res.json({
        message: 'User updTED'
      });
    });

  });

};
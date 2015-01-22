var jwt = require('jwt-simple');
var moment = require('moment');
var crypto = require('crypto');
var AWS = require('aws-sdk');
var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var config = require('../config/secrets');
/**
 * Secret Keys and Configurations.
 */


AWS.config.region = config.amazon.region;
AWS.config.update({
    accessKeyId: config.amazon.accessKeyId,
    secretAccessKey: config.amazon.secretAccessKey
});


/**
 * Model.
 */
var User = require('../models/User');

var tokenSecret = config.sessionSecret;



function createJwtToken(user) {
    var temp = {
        _id: user._id,
        slug: user.profile.slug
    };
    var payload = {
        user: temp,
        iat: new Date().getTime(),
        exp: moment().add(7, 'days').valueOf()
    };
    return jwt.encode(payload, tokenSecret);
}

exports.isLogin = function(req, res, next) {

    if (req.headers.authorization) {
        var token = req.headers.authorization;
        //.split(' ')[1];
        try {
            var decoded = jwt.decode(token, tokenSecret);
            if (decoded.exp <= Date.now()) {
                res.status(400).send('Access token has expired');
            } else {
                req.user = decoded.user;
                return next();
            }
        } catch (err) {
            return res.status(500).send('Error parsing token');
        }
    } else {
        return res.status(401);
    }
};

exports.signup = function(req, res, next) {
    var user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.profile.email = req.body.email;
    user.profile.name = req.body.name;
    user.profile.picture = 'https://s3-us-west-2.amazonaws.com/codejedi/users/default-user70';
    user.save(function(err, user, numberAffected) {
        if (err) res.send(err);
        else {
          /*added by warren to store user before join event */
          req._id = user._id;
            next();
        }

    });
};

exports.login = function(req, res, next) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (!user) return res.status(401).send('User does not exist');
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) return res.send(401, 'Invalid email and/or password');
            var token = createJwtToken(user);
            var tempy = {
                profile: user.profile
            };
            res.send({
                token: token,
                user: tempy
            });
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

    User.findOne({
        email: profile.email
    }, function(err, existingUser) {
        if (existingUser) {
            var token = createJwtToken(existingUser);
            var tempy = {
                profile: existingUser.profile
            };
            return res.send({
                token: token,
                user: tempy
            });
        }
        var user = new User();

        user.email = profile.email;
        user.profile.name = profile.name;
        user.profile.email = profile.email;
        user.save(function(err) {
            if (err) return next(err);
            else{
                var token = createJwtToken(user);
                var tempy = {
                profile: user.profile
                };
                req._id = user._id;
                req.user = tempy;
                req.token = token;
                next();
            }
            
        });
    });
};

exports.googleAuth = function(req, res, next) {
    var profile = req.body.profile;
    User.findOne({
        email: profile.emails[0].value
    }, function(err, existingUser) {
        if (err) res.send(err);

        if (existingUser) {
            console.log('heere');
            var token = createJwtToken(existingUser);
            var tempy = {
                profile: existingUser.profile
            };
            return res.send({
                token: token,
                user: tempy
            });
        }
        var user = new User();
        user.profile.name = profile.displayName;
        user.email = profile.emails[0].value;
        user.profile.email = profile.emails[0].value;
        user.save(function(err) {
            if (err) return next(err);
            else{
                var token = createJwtToken(user);
                var tempy = {
                    profile: user.profile
                };
                req._id = user._id;
                req.user = tempy;
                req.token = token;
                next();
            }
            
        });
    });
};

exports.hasEmail = function(req, res, next) {
    if (!req.query.email) {
        return res.send(400, {
            message: 'Email parameter is required.'
        });
    }

    User.findOne({
        email: req.query.email
    }, function(err, user) {
        if (err) return next(err);
            console.log(user);
        res.send({
            available: !user
        });
    });
};

exports.getUserBySlug = function(req, res) {
    if (req.params.uslug == req.user.slug) {
        User.findOne({
                'profile.slug': req.params.uslug
            })
            .populate({
                path: 'events._id',
                select: 'slug name'
            })
            .populate({
                path: 'events.team',
                select: 'slug name teamPic'
            })
            .populate({
                path: 'events.appliedTeams._id events.teamInvites._id',
                select: 'slug name teamPic'
            })
            .exec(function(err, user) {

                if (err) res.send(err);
                else if (!user) {
                    res.status(404).send('User not found');
                } else {
                    var temp = {
                        _id: user._id,
                        events: user.events,
                        profile: user.profile
                    };


                    res.json(temp);
                }
            });
    } else {
        User.findOne({
                'profile.slug': req.params.uslug
            })
            .populate({
                path: 'events._id',
                select: 'slug name'
            })
            .populate({
                path: 'events.team',
                select: 'slug name teamPic'
            })
            .exec(function(err, user) {

                if (err) res.send(err);
                else if (!user) {
                    res.status(404).send('User not found');
                } else {
                    var temp = {
                        _id: user._id,
                        profile: user.profile,
                        events: user.events
                    };
                    res.json(temp);
                }
            });

    }
};

exports.updateProfile = function(req, res) {
    User.findById(req.user._id, function(err, user) {
        if (err) res.send(err);
        
        else {
          console.log(req.body);
            user.profile.name = req.body.name;
            user.profile.nameFull = req.body.nameFull;
            user.profile.location = req.body.location;
            user.profile.website = req.body.website;
            user.profile.occupation = req.body.occupation;
            user.profile.experience = req.body.experience;
            user.profile.employers = req.body.employers;
            user.profile.skills.splice(0, user.profile.skills.length);
            for (var i = 0; i <= req.body.skills.length - 1; i++) {
                user.profile.skills.push(req.body.skills[i].text);
            };


            user.save(function(err) {
                if (err) res.send(err);
                res.json({
                    message: 'User updTED'
                });
            });
        }


    });

};
exports.deleteImagesS3 = function(req, res, next) {
    User.findById(req.user._id, function(err, user) {
        if (err) res.send(err);

        var s3Bucket = new AWS.S3({
            params: {
                Bucket: 'codejedi'
            }
        });
        if (user.profile.picture) {
            console.log(user.profile.slug);
            var params = {
                Bucket: 'codejedi/users',
                Key: user.profile.slug
            };
            

            s3Bucket.deleteObject(params, function(err, data) {
                if (err) res.send(err); 
                else {
                    next();
                }
            });
        } else {
            next();
        }

    });
};

exports.uploadImagesS3 = function(req, res) {
    User.findById(req.user._id, function(err, user) {
        if (err) res.send(err);
        var data2 = _.pick(req.body, 'type')
        , uploadPath = path.normalize('/uploads')
        , file = req.files.file;
        console.log(uploadPath);

        var s3Bucket = new AWS.S3({
            params: {
                Bucket: 'codejedi'
            }
        });
        fs.readFile(file.path,function(err,image){
            if(err) res.send(err);
            else{
                  var data = {
            Bucket: 'codejedi/users',
            Key: user.profile.slug,
            Body: image,
            ACL: 'public-read',
            ContentType: file.type
        };
        console.log(data);
        s3Bucket.putObject(data, function(err) {
            if (err) {
                console.log("ERRORRRRRR");
                res.status(500).send(err);
            } else {
                console.log('succesfully uploaded the image!');
                user.profile.picture = "https://s3-us-west-2.amazonaws.com/"+ data.Bucket + "/" + user.profile.slug;
                user.save(function(err,updatedUser) {
                    if (err) res.send(err);
                    else{
                        fs.unlink(file.path,function(err){
                            if(err) res.send(err);
                            else{
                                res.json({
                                    user: updatedUser,
                                    message: 'Upload done'
                                });
                            }
                        });
                    
                    }
                });


            }
        });
            }
        });
      




    });
};
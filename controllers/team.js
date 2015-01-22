var async = require('async');
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var Team = require('../models/Team');
var Event = require('../models/Event');
var _ = require('underscore');
var path = require('path');
var User = require('../models/User');
var fs = require('fs');
var AWS = require('aws-sdk');
var Project = require('../models/Project');
var config = require('../config/secrets');
//var secrets = new config();
//var emailController = require('./email');

//Additional for testing move or del later

AWS.config.region = config.amazon.region;
AWS.config.update({
  accessKeyId: config.amazon.accessKeyId,
  secretAccessKey: config.amazon.secretAccessKey
});


//Export Functons
exports.postCreate = function(req, res, next) {
  isTeam = false;
  isEvent = false;
  Event.findOne({
    slug: req.params.eslug
  }, function(err, event) {


    if (err) {

      res.send(err);

    } else if (!event) {
      res.status(404).send('Event not found');

    } else {


      User.findById(req.user._id, function(err, user) {
        if (err) res.send(err);
        else {
          if (user.events.id(event._id)) {
            isEvent = true;
            if (user.events.id(event._id).team == null || undefined) {
              isTeam = true;
              req.eveId = event._id;
            }
          }


          if (isEvent == false) {
            res.status(404).send('Event not joined');


          } else if (isTeam == true && isEvent == true) {
            Team.findOne({
              name: req.body.name
            }, function(err, team) {
              if (err) res.send(err);
              else if (team) {
                res.status(500).send('Team with same name already exists');
              } else next();
            });
          } else if (isEvent == true && isTeam == false) {
            res.status(404).send('Team already joined');
          }
        }




      });


    }


  });
};

exports.createTeam = function(req, res, next) {


  function slugify(text) {

    return text.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  };
  //add team id in event list....p
  var team = new Team();
  team.name = req.body.name;
  team.description = req.body.description;
  team.eventSlug = req.params.eslug;
  team.admin = req.user._id;
  team.teamPic = 'https://s3-us-west-2.amazonaws.com/codejedi/events/goa-hack/goa-hackteam-image';
  team.slug = slugify(req.body.name);

  team.members.push({
    _id: req.user._id
  });


  var project = new Project();
  project.eventSlug = req.params.eslug;
  project.teamSlug = slugify(req.body.name);
  team.problemStatement = project._id;

  User.findById(req.user._id, function(err, user) {
    if (err) return res.send(err);
    else {
      user.events.id(req.eveId).team = team._id;
      user.events.id(req.eveId).team_status = true;


      user.save(function(err,newUser) {
        if (err) return res.send(err);
        else {
          Event.findOne({
            slug: req.params.eslug
          }, function(err, event) {

            if (err) res.send(err);
            else {
              event.teamList.push({
                _id: team._id
              });


              event.save(function(err) {
                if (err) return res.send(err);
                else {
                  team.save(function(err, newTeam) {
                    if (err)
                      return res.send(err);
                    else {
                      project.save(function(err) {
                        if (err) {
                          console.log(err);
                          return res.send(err);
                        } else {
                            req.create = true;
                            req.to = newUser.email;
                            req.subject = 'Goa-Hack Team Created';
                            req.email = 'You have succesfully created the team in Goa-Hack.   Team name:'+ newTeam.name;
                            req.team = newTeam;
                            next();
                          
                        }




                      });
                    }


                  });
                }
              });

            }


          });




        }
      });

    }


  });
};

exports.getallTeams = function(req, res) {

  Team.find({
    eventSlug: req.params.eslug,
    status: 'Un-approved' /*member count search filter???maybe hide in angular*/
  }).populate({
    path: 'members._id',
    select: 'profile'
  }).populate({
    path: 'problemStatement',
    select: 'name description tags'
  }).exec(function(err, team) {
    if (err)
      res.send(err);

    else {

      res.json(team);
    }
  });
};

exports.searchTeamSlug = function(req, res) {


  Team.findOne({
      eventSlug: req.params.eslug,
      slug: req.params.tslug
    })
    .populate({
      path: 'members._id appliedMembers._id inviteMembers._id admin',
      select: 'profile'
    })
    .populate({
      path: 'chat._id',
      select: 'profile.name'
    })
    .populate({
      path: 'problemStatement',
      select: 'name description eventSlug teamSlug tags'
    })
    .exec(function(err, team) {
      if (err) {
        res.send(err);
      } else if (!team) {
        res.status(404).send('team not found');
      } else {

        res.json(team);
      }
    });
};

exports.deleteTeam = function(req, res, next) {
  Event.findOne({
    slug: req.params.eslug
  }, function(err, event) {
    if (err) {
      res.send(err);

    } else if (!event) {
      res.status(404).send('Event not found');
    } else {

      Team.findOne({
        eventSlug: req.params.eslug,
        slug: req.params.tslug
      }, function(err, team) {
        if (err) res.send(err);
        else if (!team) {
          res.status(404).send('Team not found');
        } else if (team.status == 'Approved') {
          res.status(500).send('team already approved cant delete');
        } else {
          if (team.admin == req.user._id) {
            event.teamList.pull({
              _id: team._id
            });
            event.save(function(err) {
              if (err) res.send(err);
              else {
                console.log(team.problemStatement);
                Project.remove({
                  _id: team.problemStatement
                }, function(err) {
                  if (err) res.send(err);
                  else {
                    console.log(team);
                    for (var i = team.members.length - 1; i >= 0; i--) {

                      User.findById(team.members[i]._id, function(err, user) {

                        if (err) res.send(err);

                        user.events.id(event._id).team = null;
                        user.events.id(event._id).team_status = false;
                        user.save(function(err) {
                          if (err) res.send(err);
                        });

                      });

                    };

                    team.remove();
                    res.json({
                      message: 'Successfully deleted'
                    });

                  }
                });
              }
            });




          } else {
            res.status(500).send('Not team admin');
          }
        }
      });
    }
  });
};

exports.applyTeam = function(req, res) {
  console.log("Apply reached");
  Team.findOne({
    eventSlug: req.params.eslug,
    slug: req.params.tslug
  }, function(err, team) {
    if (err) res.send(err);
    else if (!team) {
      res.status(404).send('team not found');
    } else if (team.status == 'Approved') {
      res.status(500).send('team already approved cant apply ');
    } else if (team.members.length >= 5) {
      res.status(500).send('team already full');
    } else {
      User.findById(req.user._id, function(err, user) {
        if (err) res.send(err);

        if (user.events.id(req.eveId).appliedTeams.length >= 5) {
          res.status(500).send('Cant apply for more teams');
        } else {

          if (user.events.id(req.eveId).appliedTeams.id(team._id)) {

            res.status(500).send('Already applied for team');
          } else {

            user.events.id(req.eveId).appliedTeams.push({
              _id: team._id
            });
            team.appliedMembers.push({
              _id: req.user._id
            });

            user.save(function(err) {
              if (err) return res.send(err);
              else {
                team.save(function(err, updatedTeam) {
                  if (err) return res.send(err);
                  else {
                    res.json({
                      team: updatedTeam,
                      message: 'Successfully applied'
                    });
                  }
                });
              }
            });




          }



        }



      });

    }

  });
};

exports.postUpdate = function(req, res, next) {
  Event.findOne({
    slug: req.params.eslug
  }, function(err, event) {

    if (err) res.send(err);

    else if (!event) {
      res.status(404).send('Event not found');
    } else {
      Team.findOne({
        eventSlug: req.params.eslug,
        slug: req.params.tslug
      }, function(err, team) {
        if (err) res.send(err);
        else if (!team) {
          res.status(404).send('Team not found');

        } else {
          if (team.members.id(req.user._id)) {
            if (team.admin.equals(req.user._id)) {
              console.log(event._id);
              req.eventId = event._id;
              next();
            } else {
              res.status(500).send('Not the admin');
            }
          } else {
            res.status(500).send('Not a member');
          }
        }

      });

    }
  });
};

exports.updateTeam = function(req, res) {

  Team.findOne({
      eventSlug: req.params.eslug,
      slug: req.params.tslug
    },
    function(err, team) {

      if (err) res.send(err);
      else {
        team.name = req.body.name;
        team.description = req.body.description;
        //Add here whatever fields should be updated


        team.save(function(err, updatedTeam) {
          if (err) res.send(err);
          else {
            res.json({
              team: updatedTeam,
              message: 'Team updated!'
            });
          }

        });
      }




    });
};

exports.approveMember = function(req, res, next) {

  Team.findOne({
    eventSlug: req.params.eslug,
    slug: req.params.tslug
  }, function(err, team) {
    if (err) {
      res.send(err);
    } else {
          
      User.findOne({ 'profile.slug' :req.body.approval}, function(err, user) {
        if (err) res.send(err);
        else {
          if (user.events.id(req.eventId).team) {
            res.status(500).send('Already in team');
          } else {

            if (team.appliedMembers.id(user._id)) {

              team.appliedMembers.pull({
                _id: user._id
              });
              user.events.id(req.eventId).appliedTeams.pull({
                _id: team._id
              });


              if (req.body.result == 'true') {

                if (team.members.length >= 5) {
                  res.status(500).send('Team already full');
                }

                team.members.push({
                  _id: user._id
                });

                if (team.members.length >= 3) {
                  team.member_status = true;
                } else {
                  team.member_status = false;
                }

                user.events.id(req.eventId).team = team._id;
                user.events.id(req.eventId).team_status = true;

                team.save(function(err, updatedTeam) {
                  if (err) res.send(err);
                  else {
                    user.save(function(err, updatedUser) {
                      if (err) res.send(err);
                      else {
                        req.approve = true;
                        req.to = updatedUser.email;
                        req.subject = 'Goa-Hack Team Approval';
                        req.email = 'You have been succesfully approved to Goa-Hack Team:'+ updatedTeam.name;
                        req.team = updatedTeam;
                        next();

                      }
                    });


                  }
                });




              } else if (req.body.result == 'false') {
                team.save(function(err) {
                  if (err) res.send(err);
                  else {
                    user.save(function(err) {
                      if (err) res.send(err);
                      else {
                        res.status(500).send('User unapproved');
                      }
                    });
                  }
                });




              }

            } else {
              res.status(500).send('User not applied');
            }
          }
        }

      });
    }

  });
};

exports.inviteMember = function(req, res, next) {

  Team.findOne({
    eventSlug: req.params.eslug,
    slug: req.params.tslug
  }, function(err, team) {
    if (err) res.send(err);
    else {
      User.findOne({
        email: req.body.invite
      }, function(err, user) {
        if (err) res.send(err);
        else {
          if(!user){
            res.status(500).send(' user hasn\'t joined yet');
            console.log("Hello from !user");
          }
          else if (team.inviteMembers.id(user._id)) {
            res.status(500).send('Already invited');
          } else {
            if (user.events.id(req.eventId)) {
              team.inviteMembers.push({
                _id: user._id
              });
              user.events.id(req.eventId).teamInvites.push({
                _id: team._id
              });

              team.save(function(err, updatedTeam) {
                if (err) res.send(err);
                else {
                  user.save(function(err, updatedUser) {
                    if (err) res.send(err);
                    else {
                        req.invite = true;
                        req.to = updatedUser.email;
                        req.subject = 'Goa-Hack Team Invitation';
                        req.email = 'You have recieved a Goa-Hack Team Invitation from Team:'+ updatedTeam.name;
                        req.team = updatedTeam;
                        next();

                    }
                  });

                }
              });




            } else {
              res.status(500).send('Event not joined');
            }
          }

        }

      });
    }


  });
};

exports.postAcceptInvite = function(req, res, next){
    Team.findOne({
    eventSlug: req.params.eslug,
    slug: req.params.tslug
  }, function(err, team) {
    if (err) res.send(err);
    else if (!team) {
      res.status(404).send('Team not found');
    } else {
      User.findById(
        req.user._id,
        function(err, user) {
          if (err) res.send(err);
          else {
            Event.findOne({slug:req.params.eslug},function(err,event){
                if(err)
                    res.send(err);
                else{
                if (team.inviteMembers.id(user._id)) {
              team.inviteMembers.pull({
                _id: user._id
              });
              user.events.id(event._id).teamInvites.pull({
                _id: team._id
              });
              if (req.body.result == 'false') {
                console.log('Reached Reject');
                team.save(function(err) {
                  if (err) res.send(err);
                  else {
                    user.save(function(err, updatedUser) {
                      if (err) res.send(err);
                      else {
                        res.json({
                          user: updatedUser,
                          message: 'Invitation Declined'

                        });



                      }
                    });
                  }
                });
              }
              else{
                next();
              }
            } else {
              res.status(500).send('Not invited to team');
            }
                }
            });


          }

        });
    }
  });
};

exports.acceptInvite = function(req, res, next) {

  Team.findOne({
    eventSlug: req.params.eslug,
    slug: req.params.tslug
  }, function(err, team) {
    if (err) res.send(err);
    else if (!team) {
      res.status(404).send('Team not found');
    } else {
      User.findById(
        req.user._id,
        function(err, user) {
          if (err) res.send(err);
          else {
              if (req.body.result == 'true') {
                if (team.members.length >= 5) {
                  res.status(500).send('Team full');
                }
                team.members.push({
                  _id: user._id
                });

                if (team.members.length >= 3) {
                  team.member_status = true;
                } else {
                  team.member_status = false;
                }

                user.events.id(req.eveId).team = team._id;
                user.events.id(req.eveId).team_status = true;


                team.save(function(err,updatedTeam) {
                  if (err) res.send(err);
                  else {
                    user.save(function(err, updatedUser) {
                      if (err) res.send(err);
                      else {
                        req.accept = true;
                        req.subject = 'Goa-Hack Team Invite Accepted';
                        req.to = updatedUser.email;
                        req.user = updatedUser;
                        req.email ='You have succesfully accepted the Invitation to Goa-Hack team '+ updatedTeam.name; 
                        next();
                      }
                    });
                  }
                });
              }
            

          }

        });
    }
  });
};

exports.getTeams = function(req, res) {
  var query = Team.find();
  var key = "";
  console.log(req.headers.keyword);
  if (req.query.keyword instanceof Array) {
    for (var i = 0; i < req.query.keyword.length; i++) {
      key = key + req.query.keyword[i] + " ";
      console.log(key);
    };
  } else {
    key = req.headers.keyword;
    console.log(key);
  }

  if (req.headers.keyword) {
    query = query.find({
      $text: {
        $search: key
      }
    });
    query = query.find({
      'eventSlug': req.params.eslug
    }, {
      'status': "Un-approved"
    });
    console.log(query);
    // .skip(req.query.s)
    // .limit(req.query.l);
  };
  query.exec(function(err, teams) {
    if (err) res.send(err);
    console.log(teams);
    res.json(teams);
  });
};

exports.unjoinTeam = function(req, res) {

  Event.findOne({
    slug: req.params.eslug
  }, function(err, event) {
    if (err) res.send(err);
    else {
      Team.findOne({
        eventSlug: req.params.eslug,
        slug: req.params.tslug
      }, function(err, team) {
        if (err) res.send(err);

        else if (!team) {
          res.status(404).send('Team not found');
        } else if (team.admin == req.user._id) {
          res.status(500).send('Admin cant unjoin....only delete');
        } else {

          User.findById(req.user._id, function(err, user) {
            if (err) res.send(err);
            else {
              user.events.id(event._id).team = null;
              user.events.id(event._id).team_status = false;
              team.members.pull({
                _id: req.user._id
              });
              if (team.members.length >= 3) {
                team.member_status = true;
              } else {
                team.member_status = false;
              }

              team.save(function(err, updatedTeam) {
                if (err) res.send(err);
                else {
                  user.save(function(err) {
                    if (err) res.send(err);
                    else {
                      res.json({
                        team: updatedTeam,
                        message: 'team unjoined'
                      });
                    }
                  });
                }
              });




            }


          });
        }
      });
    }


  });
};

exports.postChat = function(req, res) {
  console.log('hi');
  Team.findOne({
      eventSlug: req.params.eslug,
      slug: req.params.tslug
    },
    function(err, team) {
      if (err) res.send(err);
      else if (!team) {
        res.status(404).send('Team not found');
      } else {
        console.log(req.user._id);
        console.log(req.params.description);
        console.log(req.body.description);
        team.chat.push({
          _id: req.user._id,
          description: req.body.description
        });
        team.save(function(err) {
          if (err) res.send(err);
          else {
            res.json({
              message: 'added chat'
            });
          }
        });


      }
    });
};

exports.removeMember = function(req, res) {
  Team.findOne({
    eventSlug: req.params.eslug,
    slug: req.params.tslug
  }, function(err, team) {
    if (err) res.send(err);
    else {
      User.findOne({'profile.slug': req.body.remove}, function(err, user) {
        if (err) res.send(err);
        else {
          if (team.members.id(user._id)) {
            team.members.pull({
              _id: user._id
            });
            if (team.members.length >= 3) {
              team.member_status = true;
            } else {
              team.member_status = false;
            }
            user.events.id(req.eventId).team = null;
            user.events.id(req.eventId).team_status = false;

            team.save(function(err, updatedTeam) {
              if (err) res.send(err);
              else {
                user.save(function(err) {
                  if (err) res.send(err);
                  else {
                    res.json({
                      team: updatedTeam,
                      message: 'Member Deleted '
                    });
                  }
                });
              }
            });


          } else {
            res.status(500).send('Member not in Team');
          }
        }
      });
    }
  });
};

exports.deleteImagesS3 = function(req, res, next) {
  Team.findOne({
      eventSlug: req.params.eslug,
      slug: req.params.tslug
    },
    function(err, team) {
      if (err) res.send(err);

      var s3Bucket = new AWS.S3({
        params: {
          Bucket: 'codejedi'
        }
      });
      if (team.teamPic) {
        console.log(team.teamPic);
        var params = {
          Bucket: 'codejedi',
          Key: team.eventSlug + team.slug
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
  Team.findOne({
    eventSlug: req.params.eslug,
    slug: req.params.tslug
  }, function(err, team) {
    if (err) res.send(err);
    var data2 = _.pick(req.body, 'type'),
      uploadPath = path.normalize('/uploads'),
      file = req.files.file;
    console.log(uploadPath);

    var s3Bucket = new AWS.S3({
      params: {
        Bucket: 'codejedi'
      }
    });
    fs.readFile(file.path, function(err, image) {
      if (err) res.send(err);
      else {
        var data = {
          Bucket: 'codejedi/events/' + req.params.eslug,
          Key: team.eventSlug + team.slug,
          Body: image,
          ACL: 'public-read',
          ContentType: file.type
        };
        console.log(data);
        s3Bucket.putObject(data, function(err) {
          if (err) {
            res.status(500).send(err);
          } else {
            console.log('succesfully uploaded the image!');
            var urlParams = {
              Bucket: 'codejedi',
              Key: team.eventSlug + team.slug
            };

            team.teamPic = "https://s3-us-west-2.amazonaws.com/" + data.Bucket + "/" + team.eventSlug + team.slug;
            team.save(function(err, updatedTeam) {
              if (err) res.send(err);
              else {
                fs.unlink(file.path, function(err) {
                  if (err) res.send(err);
                  else {
                    res.json({
                      team: updatedTeam,
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

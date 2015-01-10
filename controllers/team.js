var async = require('async');
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var Team = require('../models/Team');
var Event = require('../models/Event');
var User = require('../models/User');
var Project = require('../models/Project');
var config = require('../config/secrets');
//var secrets = new config();
//var emailController = require('./email');

//Additional for testing move or del later




//Export Functons
exports.postCreate = function(req, res, next) {
    isTeam = false;
    isEvent = false;
//console.log("hello");
    Event.findOne({
        slug: req.params.eslug
    }, function(err, event) {


        if (err) {

            res.send(err);

        } else if (!event) {
            res.status(404).send('event not found');

        } else {

            //console.log(req.user);
            User.findById(req.user._id, function(err, user) {
                if (err) res.send(err);
                else {
//                console.log(user.events);
//                console.log(event._id);
                console.log(user.events[0].id);

                
                    if (user.events.id(event._id)) {
                        isEvent = true;
                        if (user.events.id(event._id).team == null || undefined) {
                            isTeam = true;
                            req.eveId = event._id;
                        }
                    }


//                    console.log(isEvent);
//                    console.log(isTeam);

                    if (isEvent == false) {
                        res.status(404).send('Event not joined');


                    } else if (isTeam == true && isEvent == true) {
                        next();
                    } else if (isEvent == true && isTeam == false) {
                        res.status(404).send('team already joined');
                    }
                }




            });


        }

        //Initial verification
    });
};

exports.createTeam = function(req, res) {


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
    team.slug = slugify(req.body.name);

    team.members.push({
        _id: req.user._id
    });


    var project = new Project();
    project.name = req.body.projName;
    if (req.body.projDesc !== null || undefined || '') {
        team.ps_status = true;
    }
    project.description = req.body.projDesc;
    project.tags = req.body.projectTags; //make sure tags puts single value in single element....p
    project.eventSlug = req.params.eslug;
    project.teamSlug = slugify(req.body.name);
    team.problemStatement = project._id;

    User.findById(req.user._id, function(err, user) {
        if (err) return res.send(err);
        else {
            user.events.id(req.eveId).team = team._id;
            user.events.id(req.eveId).team_status = true;


            user.save(function(err) {
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
                                    team.save(function(err) {
                                        if (err) return res.send(err);
                                        else {
                                            project.save(function(err) {
                                                if (err)
                                                    return res.send(err);
                                                else {
                                                    res.json({
                                                        message: 'project and team created and user plus event data saved'
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
            path: 'members._id appliedMembers._id inviteMembers._id ',
            select: 'profile'
        })
        .populate({
            path: 'chat._id',
            select: 'profile.name'
        })
        .populate({
            path: 'problemStatement',
            select: 'name description eventSlug teamSlug'
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




exports.deleteTeam = function(req, res, next) { //Can the team admin delete an admin approved team 

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
                    res.json({
                        message: 'Team not found'
                    });
                } else if (team.status == 'Approved') {
                    res.status(404).send('team already approved cant delete');
                } else {
                    if (team.admin == req.user._id) {
                        event.teamList.pull({
                            _id: team._id
                        });
                        event.save(function(err) {
                            if (err) res.send(err);
                            else {
                                Project.remove({
                                    _id: team.problemStatement
                                }, function(err, team) {
                                    if (err) res.send(err);
                                    else {
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
                        res.status(404).send('Not team admin');
                    }
                }
            });
        }
    });
};


exports.applyTeam = function(req, res) {
    Team.findOne({
        eventSlug: req.params.eslug,
        slug: req.params.tslug
    }, function(err, team) {
        if (err) res.send(err);
        else if (!team) {
            res.status(404).send('team not found');
        } else if (team.status == 'Approved') {
            res.status(404).send('team already approved cant apply ');
        } else if (team.members.length >= 5) {
            res.status(404).send('team already full');
        } else {
            User.findById(req.user._id, function(err, user) {
                if (err) res.send(err);

                if (user.events.id(req.eveId).appliedTeams.length >= 5) {
                    res.status(404).send('Cant apply for more teams');
                } else {

                    if (user.events.id(req.eveId).appliedTeams.id(team._id)) {

                        res.status(404).send('Already applied for team');
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
                                team.save(function(err) {
                                    if (err) return res.send(err);
                                    else {
                                        res.json({
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
                            req.eventId = event._id;
                            next();
                        } else {
                            res.status(404).send('Not the admin');
                        }
                    } else {
                        res.status(404).send('Not a member');
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


                team.save(function(err) {
                    if (err) res.send(err);
                    else {
                        res.json({
                            message: 'Team updated!'
                        });
                    }

                });
            }




        });

};



exports.approveMember = function(req, res) {

    Team.findOne({
        eventSlug: req.params.eslug,
        slug: req.params.tslug
    }, function(err, team) {
        if (err) {
            res.send(err);
        } else {

            User.findById(req.body.approval, function(err, user) {
                if (err) res.send(err);
                else {
                    if (user.events.id(req.eventId).team) {
                        res.status(404).send('Already in team');
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
                                    res.status(404).send('Team already full');
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

                                team.save(function(err) {
                                    if (err) res.send(err);
                                    else {
                                        user.save(function(err) {
                                            if (err) res.send(err);
                                            else {
                                                res.json({
                                                    message: 'Member Approved and Added'
                                                });
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
                                                res.status(404).send('User unapproved');
                                            }
                                        });
                                    }
                                });




                            }

                        } else {
                            res.status(404).send('User not applied');
                        }
                    }
                }

            });
        }

    });
};


exports.inviteMember = function(req, res) {

    Team.findOne({
        eventSlug: req.params.eslug,
        slug: req.params.tslug
    }, function(err, team) {
        if (err) res.send(err);
        else {
          console.log(req.body.invite);
            User.findOne({
                email: req.body.invite
            }, function(err, user) {
                if (err) res.send(err);
                else {
                  console.log(user);
                    if(team.inviteMembers.id(user._id)){
                        res.status(400).send('Already invited');
                    }
                    else{
                            if (user.events.id(req.eventId)) {
                        team.inviteMembers.push({
                            _id: user._id
                        });
                        user.events.id(req.eventId).teamInvites.push({
                            _id: team._id
                        });

                        team.save(function(err) {
                            if (err) res.send(err);
                            else {
                                user.save(function(err) {
                                    if (err) res.send(err);
                                    else {
                                        res.json({
                                            message: 'User invited....awaiting confirmation'
                                        });
                                    }
                                });

                            }
                        });




                    } else {
                        res.status(404).send('Event not joined');
                    }
                    }
                
                }

            });
        }


    });


};

exports.acceptInvite = function(req, res) {

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
                        if (team.inviteMembers(user._id)) {
                            team.inviteMembers.pull({
                                _id: user._id
                            });
                            user.events.id(req.eveId).teamInvites.pull({
                                _id: team._id
                            });
                            if (req.body.result == 'true') {
                                if (team.members.length >= 5) {
                                    res.status(404).send('Team full');
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


                                team.save(function(err) {
                                    if (err) res.send(err);
                                    else {
                                        user.save(function(err) {
                                            if (err) res.send(err);
                                            else {
                                                res.json({
                                                    message: 'Team joined'
                                                });
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
                                                res.status(404).send('Invitation Declined');

                                            }
                                        });
                                    }
                                });




                            }
                        } else {
                            res.status(404).send('Not invited to team');
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
                    res.json({
                        message: 'Team not found'
                    });
                } else if (team.admin == req.user._id) {
                    res.status(404).send('Admin cant unjoin....only delete');
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

                            team.save(function(err) {
                                if (err) res.send(err);
                                else {
                                    user.save(function(err) {
                                        if (err) res.send(err);
                                        else {
                                            res.json({
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
                team.chat.push({
                    name: req.user._id
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

};

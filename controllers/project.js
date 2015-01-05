var mongoose = require('mongoose');
var Team = require('../models/Team');
var Event = require('../models/Event');
var User = require('../models/User');
var Project = require('../models/Project');

exports.updateProject = function(req,res){//int the front end send team.problemstatement in req.body.id
	Project.findOne({_id:req.body.id,eventSlug:req.params.eslug}, function(err, project){
		if (err) res.send(err);

		project.name = req.body.name;
		project.description = req.body.description;

		project.save(function(err){
			if(err) res.send(err);
			res.json({
				message:'updatedf'
			});

		});
	});
};
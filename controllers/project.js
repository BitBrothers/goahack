var mongoose = require('mongoose');
var Team = require('../models/Team');
var Event = require('../models/Event');
var User = require('../models/User');
var Project = require('../models/Project');

exports.getProject = function(req, res){
	Project.findOne({ teamSlug: req.params.tslug, eventSlug: req.params.eslug }, function(err, project){
		if(err) res.send(err);
		else{
					res.json(project);

		}
	});
};



exports.updateProject = function(req,res){

	Project.findOne({ teamSlug: req.params.tslug, eventSlug: req.params.eslug }, function(err, project){
		if (err) res.send(err);
		else{
            console.log(req.params.tslug);
            console.log(req.params.eslug);
				project.name = req.body.name;
		if(req.body.description !== null || undefined || ''){
			ps_status = true;
			project.description = req.body.description;
		}
        for (var i = 0; i <= req.body.tags.length - 1; i++) {
            project.tags.push(req.body.tags[i].text);
        };
		
		//console.log(project);
		project.save(function(err){
			if(err) res.send(err);
			else{
				res.json({
				message:'Updated project'
			});
			}
			

		});
		}

	
	});
};
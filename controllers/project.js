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
          Team.findOne({slug:req.params.tslug, eventSlug:req.params.eslug},
                      function(err, team){
            if(err) res.send(err);
            else{

		project.name = req.body.name;
		if(req.body.description){
			team.ps_status = true;
			project.description = req.body.description;
		}
        project.tags.splice(0, project.tags.length);

        for (var i = 0; i <= req.body.tags.length - 1; i++) {
            project.tags.push(req.body.tags[i].text);
        };
		

		project.save(function(err,updatedProject){
			if(err) res.send(err);
			else{
              team.save(function(err){
                if(err) res.send(err);
                else{
                  res.json({
                    project: updatedProject,
				message:'Updated project'
			});
                }
              })
				
			}
			

		});
            }
            
          });
           
		}

	
	});
};
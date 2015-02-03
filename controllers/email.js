var secrets = require('../config/secrets')
  , path           = require('path')
  , templatesDir   = path.resolve(__dirname, '..', 'templates')
 /* , emailTemplates = require('email-templates') */ //Not Used currently
  , nodemailer     = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'Mandrill',
  auth: {
    user: secrets.mandrill.user,
    pass: secrets.mandrill.password
  }
});


/**
 * POST /contact
 * Send a contact form via Nodemailer.
 * @param email
 * @param name
 * @param message
 */
exports.contactUs = function(req, res, next){
  req.to = 'mail@bbitbrothers.in';
  req.subject = req.body.subject;
  req.email = 'Name: ' + req.body.name + '\nEmail: ' + req.body.email + '\nMessage ' + req.body.message;
  next();
};

exports.sendEmail = function(req, res) {
  var from = 'mail@goahack.com';

  var mailOptions = {
    to: req.to,
    from: from,
    subject: req.subject ,
    text: req.email
  };

  transporter.sendMail(mailOptions, function(err) {
    if (err) {
      res.send(err);
    }
    else {
      if(req.signup){
        if(req.user && req.token){
          res.json({
             user: req.user,
             token: req.token
          });
        }
        else{
          res.sendStatus(200);
        }
      }
      else if(req.create){
        res.json({
          team: req.team,
          message: 'project and team created and user plus event data saved'
        });
      }
      else if(req.invite){
        res.json({
            team: req.team,
            message: 'User invited....awaiting confirmation'
        });        
      }
      else if(req.invite2){
        res.status(500).send('User not joined goahack....Email has been sent to notify him');
      }
      else if(req.accept){
        res.json({
          user: req.user,
          message: 'Team joined'
        });
      }
      else if(req.approve){
        res.json({
          team: req.team,
          message: 'Member Approved and Added'
        });
      }
      else{
        res.json({
          message:'Mail Sent'
        });
      }
    };
  });
};
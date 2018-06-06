var express = require('express');
var router = express.Router();
var Stamp = require('../models/stamp');
var User = require('../models/user');
var _ = require('underscore');

// Show details of a particular user
router.get('/users/:id', verifyUser, (req, res) => {
   var selectedHood = req.query.hood;
   User.findById(req.params.id).exec(function(err, foundUser) {
      if (err) {
          console.log(err);
      } else {
          res.render('users/show', {
              title: foundUser.name,
              user: foundUser,
              selectedHood: selectedHood
          })
      }
   });
});

// Add a completed stamp to a user's passport
router.post('/users/:id/:stamp_id', verifyUser, (req, res) => {
    var completedStamp = req.params.stamp_id;
    var submission = (req.body.submission).toLowerCase();
    var neighborhood = req.body.neighborhood;
        switch (neighborhood) {
                case 'N':
                    neighborhood = 'nStamps';
                    break;
                case 'NW': 
                    neighborhood = 'nwStamps';
                    break;
                case 'NE':
                    neighborhood = 'neStamps';
                    break;
                case 'SW':
                    neighborhood = 'swStamps';
                    break;
                case 'SE': 
                    neighborhood = 'seStamps';
                    break;
                default:
                    console.log('I do not recognize that neighborhood');
            };
    
    Stamp.findById(req.params.stamp_id, function(err, stamp) {
        let answer = stamp.answer;    
    
   User.findById(req.params.id, function(err, user) {
            if (err) {
                res.redirect('back');
            // Check answer below
            } else if (submission === answer) {      
            user[neighborhood].push(completedStamp);
            user.save();
            stamp.usersCompleted++;
            stamp.save();
            
            // Check to see if level should be adjusted
            if (_.contains(user.neStamps, '5b10611308102d2584ff313b') && !user.neStampsDone && (user.neStamps.length >= 2)) {
                user.level++;
                user.neStampsDone = true;
            };
            res.redirect('/users/' + user._id);
             } else {
                 res.send('wrong answer');
                 }
            });
        
         });
});
// End of route to add a completed stamp to a user's passport

function verifyUser(req, res, next) {
  if(req.isAuthenticated()) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) {
            res.redirect('back');
        } else {
            if (foundUser._id.equals(req.user._id)) {
                next();
            } else {
                res.redirect('back');
            }
        }
    });
  }  else {
      res.redirect('back');
  };
};

module.exports = router;
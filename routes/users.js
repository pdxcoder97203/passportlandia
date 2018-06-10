var express = require('express');
var router = express.Router();
var Stamp = require('../models/stamp');
var User = require('../models/user');
var _ = require('underscore');

// Show details of a particular user
router.get('/users/:id', verifyUser, (req, res) => {
   var selectedHood = req.query.hood;
    
    Stamp.find({neighborhood: selectedHood}, (err, selectedHoodStamps) => {
        
       User.findById(req.params.id).exec(function(err, foundUser) {
          if (err) {
              console.log(err);
          } else {
              res.render('users/show', {
                  title: foundUser.name,
                  user: foundUser,
                  selectedHood: selectedHood,
                  stamps: selectedHoodStamps
              })
          }
       }); // end of User.find bracket
     }); // end of Stamp.find bracket
});

// Add a completed stamp to a user's passport
router.post('/users/:id/:stamp_id', verifyUser, (req, res) => {
    var completedStamp = req.params.stamp_id;
    var submission = (req.body.submission).toLowerCase();
    var neighborhood = req.body.neighborhood;
        switch (neighborhood) {
                case 'N':
                    neighborhood = 'nStamps';
                    done = 'nStampsDone';
                    break;
                case 'NW': 
                    neighborhood = 'nwStamps';
                    done = 'nwStampsDone';
                    break;
                case 'NE':
                    neighborhood = 'neStamps';
                    done = 'neStampsDone';
                    break;
                case 'SW':
                    neighborhood = 'swStamps';
                    done = 'swStampsDone';
                    break;
                case 'SE': 
                    neighborhood = 'seStamps';
                    done = 'seStampsDone';
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
                
            const requiredStamps = {
              nStamps: [],
              nwStamps: [], 
              neStamps: [],
              swStamps: [],
              seStamps: []
            };
            
            var requiredStampsDone = _.intersection(requiredStamps[neighborhood], user[neighborhood]);
                
            // Check if user level should be increased
            if ((requiredStampsDone.length === 9) && !user[done] && (user[neighborhood].length >= 12)) {
                user.level++;
                user[done] = true;
            };
                
            res.redirect('/users/' + user._id);
             } else {
                 res.render('wronganswer', {title: 'Wrong Answer'});
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
var express = require('express');
var router = express.Router();
var Stamp = require('../models/stamp');
var User = require('../models/user');

// Show details of a particular user
router.get('/users/:id', verifyUser, (req, res) => {
   User.findById(req.params.id).exec(function(err, foundUser) {
      if (err) {
          console.log(err);
      } else {
          res.render('users/show', {
              title: foundUser.name,
              user: foundUser
          })
      }
   });
});

// Add a completed stamp to a user's passport
router.post('/users/:id/:stamp_id', verifyUser, (req, res) => {
    var completedStamp = req.params.stamp_id;
    var submission = req.body.submission;
    var neighborhood = req.body.neighborhood;
        switch (neighborhood) {
                case 'n':
                    neighborhood = 'nStamps';
                    break;
                case 'nw': 
                    neighborhood = 'nwStamps';
                    break;
                case 'ne':
                    neighborhood = 'neStamps';
                    break;
                case 'sw':
                    neighborhood = 'swStamps';
                    break;
                case 'se': 
                    neighborhood = 'seStamps';
                    break;
                default:
                    console.log('I do not recognize that neighborhood');
            };
    
    let answer;
    
    Stamp.findById(req.params.stamp_id, function(err, stamp) {
        answer = stamp.answer;    
    });
    
   User.findById(req.params.id, function(err, user) {
      if (err) {
          console.log(err);
          res.redirect('/stamps');
      } else if (submission === answer) {
            user[neighborhood].push(completedStamp);
            user.save();
            res.redirect('/users/' + user._id);
             } else {
                 console.log('That is not the correct answer!');
                 res.redirect('/users/' + user._id);
             }
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
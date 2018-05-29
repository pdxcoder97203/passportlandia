var express = require('express');
var router = express.Router();
var Stamp = require('../models/stamp');
var Comment = require('../models/comment');

// Stamps index
router.get('/stamps', (req, res) => {
    Stamp.find({}, (err, allStamps) => {
        if (err) {
            console.log(err);
        } else {
            res.render('stamps/index', {title: 'Stamps', stamps: allStamps}); 
        }
    });
});

// Add new stamp route
router.post('/stamps', loginCheck, (req, res) => {
    var name = req.body.name;
    var hood = req.body.hood;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newStamp = {
        name: name,
        neighborhood: hood,
        image: image,
        description: description,
        author: author,
        reqStamp: true,
    };
    Stamp.create(newStamp, (err, newlyCreated) => {
       if (err) {
           console.log(err); 
       } else {
           res.redirect('/stamps');
       };
    });
});

// Add stamp form 
router.get('/stamps/new', loginCheck, (req, res) => {
   res.render('stamps/new', {title: 'Add Stamp'}) 
});

// Show details of a particular stamp
router.get('/stamps/:id', (req, res) => {
   Stamp.findById(req.params.id).populate('comments').exec(function(err, foundStamp) {
      if (err) {
          console.log(err);
      } else {
          res.render('stamps/show', {
              title: foundStamp.name,
              stamp: foundStamp
          })
      }
   });
});

function verifyStampOwner(req, res, next) {
  if(req.isAuthenticated()) {
    Stamp.findById(req.params.id, function(err, foundStamp) {
        if (err) {
            res.redirect('back');
        } else {
            if (foundStamp.author.id.equals(req.user._id)) {
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

function loginCheck(req, res, next) {
  if (req.isAuthenticated()) {
    return next();  
  };
    res.redirect('/login');
};

module.exports = router;

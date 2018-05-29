var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Landing page
router.get('/', (req, res) => {
   res.render('landing', {title: 'Passportlandia'}); 
});

// Show sign up form
router.get('/signup', (req, res) => {
    res.render('signup', {title: 'Signup'});
});

// Signup post route
router.post('/signup', (req, res) => {
   var newUser = new User({
        username: req.body.username,
        level: 'Fanny Packer'
   });
    User.register(newUser, req.body.password, function(err, user){
       if (err) {
           console.log(err);
           return res.render('signup', {title: 'Signup'});
       } else
        passport.authenticate('local')(req, res, function(){
           res.redirect('stamps'); 
        });
    });
});

// Show login form
router.get('/login', (req, res) => {
   res.render('login', {title: 'Login'}); 
});

// Login post route
router.post('/login', passport.authenticate('local', {
    successRedirect: '/stamps',
    failureRedirect: '/login'
}), function(req, res) { 
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/stamps');
});

module.exports = router;

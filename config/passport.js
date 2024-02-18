const LocalStrategy = require('passport-local').Strategy;
const request = require('request');

//------------ API Configuration ------------//
const baseUrl = require('../config/key').baseUrl;

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
            //------------ User Matching ------------//
            console.log('in passport'); 

            request({
                url: baseUrl+'/User/Login',
                method: 'POST',
                body:{
                    "user_name":username,
                    "password":password
                    },
                json: true
              }, function (err, res, body) {

                if (err) { 
                    return done(null, false, { message: 'Login Error!' });  
                 }
                //  console.log(body);
                if (body.response.Status == 'Success') {
                    return done(null, body.data);

                }else if(body.response.Status == 'Fail'){
                    return done(null, false, { message: `Invalid Login! ${body.response.Details}` });  
                }else{
                    return done(null, false, { message: 'Invalid Login! ${body.response.Details}' });  
                }
            });

        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);  
    });
};
const passport = require('passport');
const request = require('request');
const baseUrl = require('../config/key').baseUrl;

//------------ Login Handle ------------//
exports.loginHandle = (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
}

exports.resetPassword = (req, resp) => {
    const { id, username, token, cpass, npass, vpass } = req.body;

    //------------ Checking required fields ------------//
    if (!cpass || !npass || !vpass) {
        req.flash(
            'error_msg',
            'Please enter required fields.'
        );
        resp.redirect(`/auth/reset_pass`);
    }else if(npass != vpass){
        req.flash(
            'error_msg',
            'Password mismatch! Please Try Again.'
        );
        resp.redirect(`/auth/reset_pass`);
    }else{

// set new password 
request({
    headers: {
        'AccessToken': token
    },
    url: baseUrl+"/User/setPassword",
    method: 'POST',
    body:{
        "user_id":id,
        "user_name":username,
        "new_password":npass
    },
    json: true
  }, function (err, res, body) {
    if(err) throw err;
    console.log(body); 
    if (body.response.Status =='Success') {
        req.flash('success_msg', body.response.Details);
        resp.redirect('/auth/reset_pass'); 
    }
});
    }

}

//------------ Logout Handle ------------//
exports.logoutHandle = (req, res) => {
    res.clearCookie("accToken");
    req.logout();
    req.flash('success_msg', 'You are logged out');
    req.session.destroy();
    res.redirect('/auth/login');
}
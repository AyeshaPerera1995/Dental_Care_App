const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')

//------------ Importing Controllers ------------//
const authController = require('../controllers/authController');

//------------ Login Route ------------//
router.get('/login', (req, res) => res.render('login'));

//------------ Login POST Handle ------------//
router.post('/login', authController.loginHandle);

//------------ Reset Password Route ------------//
router.get('/reset_pass', ensureAuthenticated, (req, res) => {
    res.render('reset_password', {
        title: 'User Profile',
        sub_title: 'Reset Password',
        cuser: req.user
    })
});

// //------------ Reset Password Handle ------------//
router.post('/reset_pass', ensureAuthenticated, authController.resetPassword);

//------------ Logout GET Handle ------------//
router.get('/logout', authController.logoutHandle);

module.exports = router;
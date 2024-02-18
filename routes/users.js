const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')

const request = require('request');
const baseUrl = require('../config/key').baseUrl;

//------------ Importing Controllers ------------//
const userController = require('../controllers/userController');

//------------ View Users Route ------------//
router.get('/view_users', ensureAuthenticated, function(req,resp){

    var accessToken = req.cookies.accessToken;
    // console.log(accessToken);
    request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/User/UserList",
        method: 'GET',
        json: true
      }, function (err, res, body) {
          if(err) throw err;
        // console.log(body.data.length); 
        if (body.response.Status =='Success') {
             resp.render('view_users',{
                title: 'View Information',
                sub_title: 'View Users',
                userlist:  body.data,
                accessToken: accessToken,
                success_msg: '',
                error_msg: '',
                delete_msg: ''   
            });
        }
      });
      
});

//------------ Add User Route ------------//
router.get('/add_user', ensureAuthenticated, (req, res) => 
res.render('add_user', {
    title: 'Add Information',
    sub_title: 'New User',
    error_msg: '',
    success_msg: '' 
})
);

router.post('/add_user', ensureAuthenticated, userController.createUser);

router.get('/change_status/:id&:status', ensureAuthenticated, userController.changeStatus);

//------------ Edit User ------------//
router.get('/edit_user/:id', ensureAuthenticated, function(req,resp){
    const id = req.params.id;
    const accessToken = req.cookies.accessToken;

    // get user obj 
    request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/User/UserByID?Userid="+id,
        method: 'GET',
        json: true
      }, function (err, res, body) {
          if(err) throw err;
        if (body.response.Status =='Success') {
            console.log('first ');
            resp.render('edit_user',{
                title: 'Edit Information',
                sub_title: 'Update User',
                user:  body.data    
            });

        }
      });
   
});

router.post('/edit_user/:id', ensureAuthenticated, userController.updateUser);

router.get('/delete_user/:id', ensureAuthenticated, userController.deleteUser);


module.exports = router;

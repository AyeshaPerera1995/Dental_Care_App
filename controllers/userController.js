const request = require('request');
const baseUrl = require('../config/key').baseUrl;

//------------ Create User Handle ------------//
exports.createUser = (req, resp) => {
    const { fname, lname, username, user_type, password, cpassword, accessToken } = req.body;
    var error_msg = '';

    console.log(req.body);

    //------------ Checking required fields ------------//
    if (!fname || !lname || !username || !user_type || !password || !cpassword) {
        error_msg = 'Please fill required fields.';
    }

    if (error_msg != '') {
        resp.render('add_user', {
            title: 'Add Information',
            sub_title: 'New User',
            error_msg: error_msg
        });
    } else {

        request({
            headers: {
                'AccessToken': accessToken
            },
            url: baseUrl+"/User/UserRegistration",
            method: 'POST',
            body:{
                "user_name":username,
                "first_name":fname,
                "last_name":lname,
                "contact_number":"",
                "email":"",
                "user_type":user_type,
                "password":password
            },
            json: true
          }, function (err, res, body) {
            if(err) throw err;
            console.log(body); 
            if (body.response.Status =='Fail') {
                console.log(body.response.Details);
                error_msg = 'Error! Please try again.';
                resp.render('add_user',{error_msg: error_msg, sub_title: 'New User', title: 'Add Information'});
            }else{
                console.log('else');
                resp.render('add_user',{success_msg: 'User saved successfully.', sub_title: 'New User', title: 'Add Information'});
            }
          });

    }
}


//------------ Update User Handle ------------//
exports.updateUser = (req, resp) => {
    const id = req.params.id;
    const { fname, lname, user_type, contact, email } = req.body;
    const accessToken = req.cookies.accessToken;
    var error_msg = '';
    var user = '';

    console.log(id);
    console.log(req.body);

    //------------ Checking required fields ------------//
    if (!fname || !lname || !user_type) {
        error_msg = 'Please fill required fields.';
    }

    if (error_msg != '') {   
        // get user obj 
        request({
            headers: {
                'AccessToken': accessToken
            },
            url: baseUrl+"/User/UserByID?Userid="+id,
            method: 'GET',
            json: true
          }, function (err, res, body) {
              user = body.data;
            if(err) throw err;
            if (body.response.Status =='Success') {  
                resp.render('edit_user',{
                    title: 'Edit Information',
                    sub_title: 'Update User',
                    error_msg: error_msg,
                    user: body.data    
                });
    
            }
          });
    } else {

        request({
            headers: {
                'AccessToken': accessToken
            },
            url: baseUrl+"/User/UpdateUser",
            method: 'POST',
            body:{
                "id":id,
                "first_name":fname,
                "last_name":lname,
                "contact_number":contact,
                "email":email,
                "user_type":user_type
            },
            json: true
          }, function (err, res, body) {
            if(err) throw err;
            // console.log(body); 
            if (body.response.Status =='Fail') {
                console.log(body);
                error_msg = 'Error! Please try again.';
                resp.render('edit_user',{error_msg: error_msg, user: user, sub_title: 'Update User', title: 'Edit Information'});
            }else{
                console.log('ok');
                console.log(body);
                resp.render('edit_user',{success_msg: body.response.Details, user: user, sub_title: 'Update User', title: 'Edit Information'});
            }
          });

    }
}


// Change User Status
exports.changeStatus = (req, resp) => {
    const id = req.params.id;
    const status = req.params.status; 
    var accessToken = req.cookies.accessToken;

    request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/User/SetUserStatus",
        method: 'POST',
        body:{
            "id":id,
            "status":status  
        },
        json: true
      }, function (err, res, body) {
        if(err) throw err;
        console.log(body); 
        if (body.Status =='Success') {

            // get user list 
            request({
                headers: {
                    'AccessToken': accessToken
                },
                url: baseUrl+"/User/UserList",
                method: 'GET',
                json: true
              }, function (err, res, body_userlist) {
                resp.render('view_users',{success_msg: 'Account status changed successfully.', delete_msg: '', userlist:  body_userlist.data, accessToken: accessToken  , sub_title: 'View Users', title: 'View Information'});
              });

            
        }
    });

}

// Delete User
exports.deleteUser = (req, resp) => {
    const id = req.params.id;
    const status = 'Deleted';
    var accessToken = req.cookies.accessToken;

    request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/User/SetUserStatus",
        method: 'POST',
        body:{
            "id":id,
            "status":status  
        },
        json: true
      }, function (err, res, body) {
        if(err) throw err;
        if (body.Status =='Success') {

            // get user list 
            request({
                headers: {
                    'AccessToken': accessToken
                },
                url: baseUrl+"/User/UserList",
                method: 'GET',
                json: true
              }, function (err, res, body_userlist) {
                resp.render('view_users',{delete_msg: 'User account deleted successfully.', userlist:  body_userlist.data, accessToken: accessToken  , sub_title: 'View Users', title: 'View Information'});
              });

        }
    });

}

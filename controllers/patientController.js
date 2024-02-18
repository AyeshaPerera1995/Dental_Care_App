const request = require('request');
const baseUrl = require('../config/key').baseUrl;

//------------ Create Patient Handle ------------//
exports.addPatient = (req, resp) => {
    console.log('in controller');
    const { type, ap_nic, ap_name, ap_dob, ap_gender, ap_address, ap_contact, parent_name, parent_nic, parent_contact, parent_address, child_name, child_dob, child_gender, accessToken } = req.body;
    var error_msg = '';

    console.log(req.body.dob);

    //------------ Checking required fields ------------//
    if (type == 'Adult') {
        if (!ap_name || !ap_nic || !ap_gender || !ap_contact || !ap_address) {
            error_msg = 'Please fill all required fields.';
        }
    } else if (type == 'Child'){
        if (!parent_name || !parent_nic || !parent_contact || !parent_address || !child_name || !child_dob || !child_gender) {
            error_msg = 'Please fill all required fields.';
        } 
    }

    if (error_msg != '') {
        resp.render('add_patient', {
            title: 'Add Information',
            sub_title: 'New Patient',
            error_msg: error_msg
        });
    } else {

        if (type == 'Adult') {
            request({
                headers: {
                    'AccessToken': accessToken
                },
                url: baseUrl+"/patient/PatientRegistration",
                method: 'POST',
                body:{
                    "type": type,
                    "parent_name": "",
                    "nic": ap_nic,
                    "name": ap_name,
                    "dob": ap_dob,
                    "age": "",
                    "gender": ap_gender,
                    "address": ap_address,
                    "contact_number": ap_contact,
                    "status":"New",
                    "created_by": req.user.user_name
                },
                json: true
              }, function (err, res, body) {
                if(err) throw err;
                console.log(body); 
                if (body.response.Status =='Fail') {
                    console.log(body.response.Details);
                    error_msg = 'Error! Please try again.';
                    resp.render('add_patient',{error_msg: error_msg, sub_title: 'New Patient', title: 'Add Information',});
                }else{
                    resp.render('add_patient',{success_msg: 'Patient saved successfully.', sub_title: 'New Patient', title: 'Add Information',});
                }
              });
            
        } else if (type == 'Child'){
            request({
                headers: {
                    'AccessToken': accessToken
                },
                url: baseUrl+"/patient/PatientRegistration",
                method: 'POST',
                body:{
                    "type": type,
                    "parent_name": parent_name,
                    "nic": parent_nic,
                    "name": child_name,
                    "dob": child_dob,
                    "age": "",
                    "gender": child_gender,
                    "address": parent_address,
                    "contact_number": parent_contact,
                    "status":"New",
                    "created_by": req.user.user_name
                },
                json: true
              }, function (err, res, body) {
                if(err) throw err;
                if (body.response.Status =='Fail') {
                    console.log(body.response.Details);
                    error_msg = 'Error! Please try again.';
                    resp.render('add_patient',{error_msg: error_msg, sub_title: 'New Patient', title: 'Add Information',});
                }else{
                    resp.render('add_patient',{success_msg: 'Patient saved successfully.', sub_title: 'New Patient', title: 'Add Information',});
                }
              });
        }

    }
}

//------------ Update Patient Handle ------------//
exports.updatePatient = (req, resp) => {
    const id = req.params.id;
    const { name, dob, gender, contact, address } = req.body;
    const accessToken = req.cookies.accessToken;
    var error_msg = '';
    var patient = '';

    console.log(id);
    console.log(req.body);

    //------------ Checking required fields ------------//
    if (!name || !dob || !gender || !contact || !address) {
        error_msg = 'Please fill all required fields.';
    }

    if (error_msg != '') {   
        // get patient obj 
        request({
            headers: {
                'AccessToken': accessToken
            },
            url: baseUrl+"/patient/getpatientbyid?id="+id,
            method: 'GET',
            json: true
          }, function (err, res, body) {
              if(err) throw err;
            if (body.response.Status =='Success') {
                resp.render('edit_patient',{
                    title: 'Edit Information',
                    sub_title: 'Update Patient',
                    patient: body.data,
                    error_msg: error_msg    
                });
    
            }
        });

    } else {
        // update patient
	    var age = new Date().getFullYear() - dob.split('-')[0];

        request({
            headers: {
                'AccessToken': accessToken
            },
            url: baseUrl+"/patient/UpdatePatient",
            method: 'POST',
            body:{
                "id": id,
                "name": name,
                "dob": dob,
                "age": age,
                "gender": gender,
                "address": address,
                "contact_number": contact
            },
            json: true
          }, function (err, res, body) {
            if(err) throw err;
            if (body.response.Status =='Success') {
                resp.render('view_patients',{
                    success_msg: body.response.Details, 
                    title: 'View Information',
                    sub_title: 'View Patients',
                    accessToken: accessToken  
                });
            }else{
                console.log('update patient');
                resp.render('view_patients',{
                    error_msg: body.response.Details, 
                    title: 'View Information',
                    sub_title: 'View Patients',
                    accessToken: accessToken  
                });
            }
          });

    }
}

// Delete Patient
exports.deletePatient = (req, resp) => {
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
            req.flash('success_msg', 'User deleted successfully.');
            resp.redirect('/users/view_users'); 
        }
    });

}
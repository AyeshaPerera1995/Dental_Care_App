const request = require('request');
const baseUrl = require('../config/key').baseUrl;

//------------ Create User Handle ------------//
exports.createApp = (req, resp) => {
    const { patient_id, date, type, accessToken, search_patient } = req.body;
    var error_msg = '';

    var correct_date = date.split('-')[2]+'-'+date.split('-')[1]+'-'+date.split('-')[0];

    // console.log(search_patient);

    //------------ Checking required fields ------------//
    if (!date || !type) {
        error_msg = 'Please fill all required fields.';
    }

    if (error_msg != '') {
        resp.render('add_appointment', {
            title: 'Add Information', sub_title: 'New Appointment', error_msg: error_msg 
        });
    } else {
        // check if the selected date is avaliable or not
        request({
            headers: {
                'AccessToken': accessToken
            },
            url: baseUrl+"/appointment/nextappointmentbydate?date="+correct_date,
            method: 'GET',
            json: true
          }, function (err, res, body) {
            if(err) throw err;
            // console.log(res);
            if (body.data.status =='Full') {
                error_msg = 'Daily appointment count is exceed! Please try again.';
                resp.render('add_appointment',{error_msg: error_msg, sub_title: 'New Appointment', title: 'Add Information', data_num: '', data_name: '',data_date: '', patient_nic: search_patient});
            }else if(body.data.status == 'Available'){
                
                // create appointment 
                request({
                    headers: {
                        'AccessToken': accessToken
                    },
                    url: baseUrl+"/appointment/CreateAppointment",
                    method: 'POST',
                    body:{
                        "date":correct_date,
                        "appointment_type":type,
                        "patient_id":patient_id
                    },
                    json: true
                }, function (err, res, body) {
                    if(err) throw err;
                    if (body.response.Status =='Fail') {
                        console.log('fail');
                        resp.render('add_appointment',{error_msg: body.response.Details, sub_title: 'New Appointment', title: 'Add Information', data_num: '', data_name: '',data_date: '', patient_nic: ''});
                    }else{
                        console.log('success');
                        resp.render('add_appointment',{success_msg: 'Appointment created successfully.', sub_title: 'New Appointment', title: 'Add Information', data_num: body.data.appointment_number, data_name:body.data.patient_name, data_date:body.data.date, patient_nic: ''});
                        
                    }
                });

            }
          });

    }
}
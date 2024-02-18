const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const request = require('request');
const baseUrl = require('../config/key').baseUrl;
const moment = require('moment');

//------------ Importing Controllers ------------//
const appController = require('../controllers/appController');

//------------ View App Route ------------//
router.get('/view_appointments', ensureAuthenticated, function(req,resp){

    var date = new Date();
    var invdate = new Date(date.toLocaleString('en-US', { timeZone: "Asia/Colombo"}));
    var diff = date.getTime() - invdate.getTime();
    var convert_date = new Date(date.getTime() - diff);
    var appDate = moment(convert_date, "DD/MM/YYYY, h:mm:ss a").format("DD-MM-YYYY");
    var c_date = moment(convert_date, "DD/MM/YYYY, h:mm:ss a").format("YYYY-MM-DD");

    var accessToken = req.cookies.accessToken;
    request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/appointment/getappointmentlistnydate?date="+appDate,
        // url: baseUrl+"/appointment/getappointmentlistnydate?date=09-02-2022",
        method: 'GET',
        json: true
      }, function (err, res, body) {
          if(err) throw err; 
          // sorting data 
          var bodydata = body.data;
		  let sortedData = bodydata.slice().sort((a, b) => a.id - b.id);
        if (body.response.Status =='Success') {
             resp.render('view_appointments',{
                title: 'View Information',
                sub_title: 'View Appointments',
                applist:  sortedData,
                accessToken: accessToken,
                c_date: c_date,
                url_date: appDate,
                success_msg: '',
                error_msg: '',
                delete_msg: ''   
            });
        }
      });
});

//------------ Add App Route ------------//
router.get('/add_appointment', ensureAuthenticated, (req, res) => 
res.render('add_appointment', {
    title: 'Add Information',
    sub_title: 'New Appointment',
    error_msg: '',
    success_msg: '',
    nic: '',
    data_num: '',  
    data_name: '',
    data_date: '',
    patient_nic: '' 
})
);

router.post('/add_appointment', ensureAuthenticated, appController.createApp);

// print number 
router.get('/print_number/:number&:name&:date', ensureAuthenticated, (req, res) => {
    const number = req.params.number;
    const name = req.params.name;
    const c_date = req.params.date; // 18-02-2022
    var today = c_date.split('-')[2] + '-' + c_date.split('-')[1] + '-' + c_date.split('-')[0];

    console.log(today);
    var date = new Date(today);
    console.log(date);
    var invdate = new Date(date.toLocaleString('en-US', { timeZone: "Asia/Colombo"}));
    var diff = date.getTime() - invdate.getTime();
    var convert_date = new Date(date.getTime() - diff);
    console.log(convert_date);
    var print_date = moment(convert_date, "DD/MM/YYYY, h:mm:ss a").format("Do MMMM YYYY");

    // var today = c_date.split('-')[2] + '-' + c_date.split('-')[1] + '-' + c_date.split('-')[0];
    // var convertedDate = moment(today, "YYYY-MM-DD").format("Do MMMM YYYY dddd");
    // // convert to SL time 
    // var date = convertedDate.toLocaleString('en-US', { timeZone: 'Asia/Colombo'});

    res.render('print_number', {
    title: 'Add Information',
    sub_title: 'New Appointment',
    error_msg: '',
    success_msg: '',
    name: name,
    date: print_date,
    number:number   
})
});

module.exports = router;

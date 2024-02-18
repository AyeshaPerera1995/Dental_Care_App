const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');
const moment = require('moment');

const request = require('request');
const baseUrl = require('../config/key').baseUrl;

//------------ Welcome Route ------------//
router.get('/', (req, res) => {
    res.render('index');
});

//------------ Dashboard Route ------------//
router.get('/dashboard', ensureAuthenticated, (req, resp) =>{
    resp.cookie('accessToken', req.user.accesstoken);

    // Europe/London 
    var date = new Date();
    var invdate = new Date(date.toLocaleString('en-US', { timeZone: "Asia/Colombo"}));
    var diff = date.getTime() - invdate.getTime();
    var convert_date = new Date(date.getTime() - diff);
    var appDate = moment(convert_date, "DD/MM/YYYY, h:mm:ss a").format("DD-MM-YYYY");
    var c_date = moment(convert_date, "DD/MM/YYYY, h:mm:ss a").format("Do MMMM YYYY , h:mm:ss a");

    // get today appoinment list 
    request({
        headers: {
            'AccessToken': req.user.accesstoken
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

          resp.render('dashboard', {
            title: '',
            sub_title: 'Dashboard',
            applist:  sortedData,
            app_date: appDate,
            c_date:c_date,
            accessToken:req.user.accesstoken 
        });
      });
   
});

module.exports = router;
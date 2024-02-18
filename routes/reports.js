const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const moment = require('moment');

const request = require('request');
const baseUrl = require('../config/key').baseUrl;

//------------ Importing Controllers ------------//
// const userController = require('../controllers/userController');

router.get('/daily_income', ensureAuthenticated, function(req,resp){

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
        url: baseUrl+"/Invoice/GetPaymentsBydate?date="+appDate,
        // Invoice/GetPaymentsBydate?date=02-12-2021
        method: 'GET',
        json: true
      }, function (err, res, body) {
          if(err) throw err; 
          // sorting data 
          var bodydata = body.data;
		  let sortedData = bodydata.slice().sort((a, b) => a.id - b.id);
        if (body.response.Status =='Success') {
             resp.render('daily_income',{
                title: 'Reports',
                sub_title: 'Daily Income',
                incomelist:  sortedData,
                accessToken: accessToken,
                c_date: c_date,
                url_date: appDate  
            });
        }
      });
});

router.get('/print_daily_report/:date', ensureAuthenticated, function(req,resp){
    const select_date = req.params.date;
    const accessToken = req.cookies.accessToken;

    var date = new Date();
    var invdate = new Date(date.toLocaleString('en-US', { timeZone: "Asia/Colombo"}));
    var diff = date.getTime() - invdate.getTime();
    var convert_date = new Date(date.getTime() - diff);
    var c_date = moment(convert_date, "DD/MM/YYYY, h:mm:ss a").format("YYYY-MM-DD");
    var s_date = moment(select_date, "DD/MM/YYYY, h:mm:ss a").format("YYYY-MM-DD");

    request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/Invoice/GetPaymentsBydate?date="+select_date,
        method: 'GET',
        json: true
      }, function (err, res, body) {
          if(err) throw err; 
          // sorting data 
          var bodydata = body.data;
		  let sortedData = bodydata.slice().sort((a, b) => a.id - b.id);
        if (body.response.Status =='Success') {
             resp.render('daily_income_preview',{
                title: 'Reports',
                sub_title: 'Daily Income',
                incomelist:  sortedData,
                c_date: c_date,
                select_date: s_date 
            });
        }
      });

});

module.exports = router;

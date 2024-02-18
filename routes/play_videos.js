const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');
const request = require('request');
const baseUrl = require('../config/key').baseUrl;

router.get('/display_videos', (req, resp) => {
    var accessToken = req.cookies.accessToken;
    request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/basic/getURL",
        method: 'GET',
        json: true
      }, function (err, res, body) {
          if(err) throw err;
        if (body.response.Status =='Success') {
            var video_url = body.data.url;

            // get appoinment number 
            var now = new Date();
            var month = (now.getMonth() + 1);               
            var day = now.getDate();
            if (month < 10)  month = "0" + month;
            if (day < 10)  day = "0" + day;
            var today = day + '-' + month + '-' + now.getFullYear();

            request({
                url: baseUrl+"/appointment/getcurrentNumber?date="+today,
                method: 'GET',
                json: true
              }, function (err, res, body) {
                    resp.render('display_videos',{
                        video_url: video_url,
                        number: (body.data.current_number)
                    });
              });

           
        }
    });

});

module.exports = router;

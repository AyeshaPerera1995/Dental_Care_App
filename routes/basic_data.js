const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');
const request = require('request');
const baseUrl = require('../config/key').baseUrl;

const basicController = require('../controllers/basicController');

router.get('/', ensureAuthenticated, (req, resp) => {
    var accessToken = req.cookies.accessToken;
    // get brand list 
    request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/basic/getBrandList",
        method: 'GET',
        json: true
      }, function (err, res, brandlist) {
        
        // get cat list 
        request({
            headers: {
                'AccessToken': accessToken
            },
            url: baseUrl+"/basic/getCategoryList",
            method: 'GET',
            json: true
          }, function (err, res, catlist) {
            
            resp.render('basic_data',{
                title: 'Settings',
                sub_title: 'Basic Data',
                error_msg: '',
                success_msg: '',
                brandlist: brandlist.data,
                catlist: catlist.data  
            });

          });
      });
});

router.post('/add_brand', ensureAuthenticated, basicController.addBrand);

router.post('/add_category', ensureAuthenticated, basicController.addCategory);

router.post('/set_url', ensureAuthenticated, basicController.setURL);

router.get('/set_brand_status/:id&:status', ensureAuthenticated, basicController.setBrandStatus);

router.get('/set_cat_status/:id&:status', ensureAuthenticated, basicController.setCatStatus);

module.exports = router;
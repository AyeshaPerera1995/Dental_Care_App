const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');
const request = require('request');
const baseUrl = require('../config/key').baseUrl;

//------------ Importing Controllers ------------//
const drugController = require('../controllers/drugController');

//------------ View Drugs Route ------------//
router.get('/view_drugs', ensureAuthenticated, function(req,resp){
    var accessToken = req.cookies.accessToken;

    request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/Drug/DrugList",
        method: 'GET',
        json: true
      }, function (err, res, body) {
          if(err) throw err;
        // console.log(body.data.length); 
        if (body.response.Status =='Success') {
             resp.render('view_drugs',{
                title: 'View Information',
                sub_title: 'View Drugs',
                druglist:  body.data,
                accessToken: accessToken,
                delete_msg: ''   
            });
        }
      });
});

//------------ Add Drug Route ------------//
router.get('/add_drug', ensureAuthenticated, (req, resp) => {
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
    resp.render('add_drug', {
        title: 'Add Information',
        sub_title: 'New Drug',
        error_msg: '',
        success_msg: '',
        brandlist:brandlist.data,
        catlist: catlist.data  
    })
});
});
});

router.post('/add_drug', ensureAuthenticated, drugController.addDrug);

//------------ Edit Drug ------------//
router.get('/edit_drug/:id', ensureAuthenticated, function(req,resp){
    const id = req.params.id;
    const accessToken = req.cookies.accessToken;

    // get drug obj 
    request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/Drug/DrugByID",
        method: 'GET',
        body:{
            "id":id
        },
        json: true
      }, function (err, res, body) {
          if(err) throw err;
        if (body.response.Status =='Success') {
            resp.render('edit_drug',{
                title: 'Edit Information',
                sub_title: 'Update Drug',
                drug:  body.data,
                error_msg: '',
                success_msg: ''      
            });

        }
      });  
});

router.post('/edit_drug/:id', ensureAuthenticated, drugController.updateDrug);

router.get('/delete_drug/:id', ensureAuthenticated, drugController.deleteDrug);

module.exports = router;

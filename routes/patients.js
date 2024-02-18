const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')

const request = require('request');
const baseUrl = require('../config/key').baseUrl;

//------------ Importing Controllers ------------//
const patientController = require('../controllers/patientController');

//------------ View Users Route ------------//
router.get('/view_patients', ensureAuthenticated, function(req,res){
    var accessToken = req.cookies.accessToken;
        res.render('view_patients',{
            title: 'View Information',
            sub_title: 'View Patients',
            accessToken: accessToken,
            delete_msg: ''             
        });
});

//------------ Add User Route ------------//
router.get('/add_patient', ensureAuthenticated, (req, res) => 
res.render('add_patient', {
    title: 'Add Information',
    sub_title: 'New Patient',
    error_msg: '',
    success_msg: ''   
})
);

router.post('/add_patient', ensureAuthenticated, patientController.addPatient);

//------------ Edit User ------------//
router.get('/edit_patient/:id', ensureAuthenticated, function(req,resp){
    const id = req.params.id;
    const accessToken = req.cookies.accessToken;

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
                patient:  body.data,
                error_msg: '',
                success_msg: ''     
            });

        }
      });
   
});

router.post('/edit_patient/:id', ensureAuthenticated, patientController.updatePatient);

router.get('/delete_patient/:id', ensureAuthenticated, patientController.deletePatient);

module.exports = router;

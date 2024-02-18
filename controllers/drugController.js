const request = require('request');
const baseUrl = require('../config/key').baseUrl;

//------------ Create User Handle ------------//
exports.addDrug = (req, resp) => {
    const { name, brand, category, qty, accessToken } = req.body;
    var error_msg = '';

    console.log(req.body);

    //------------ Checking required fields ------------//
    if (!name || !brand || !category || !qty) {
        error_msg = 'Please fill all required fields.';
    }

    if (error_msg != '') {
        resp.render('add_drug', {
            title: 'Add Information', sub_title: 'New Drug', error_msg: error_msg 
        });
    } else {
        request({
            headers: {
                'AccessToken': accessToken
            },
            url: baseUrl+"/drug/savedrug",
            method: 'POST',
            body:{
                "name":name,
                "brand":brand,
                "category":category,
                "volume":100,
                "qty":qty
            },
            json: true
          }, function (err, res, body) {
            if(err) throw err;
            console.log(body); 
            if (body.response.Status =='Fail') {
                console.log(body.response.Details);
                error_msg = 'Error! Please try again.';
                resp.render('add_drug',{error_msg: error_msg, sub_title: 'New Drug', title: 'Add Information'});
            }else{
                resp.render('add_drug',{success_msg: body.response.Details, sub_title: 'New Drug', title: 'Add Information'});
            }
          });

    }
}

//------------ Update Drug Handle ------------//
exports.updateDrug = (req, resp) => {
    const id = req.params.id;
    const { name, brand, category, qty } = req.body;
    const accessToken = req.cookies.accessToken;
    var error_msg = '';
    var drug = '';

    console.log(id);
    console.log(req.body);

    //------------ Checking required fields ------------//
    if (!name || !brand || !category || !qty) {
        error_msg = 'Please fill all required fields.';
    }

    if (error_msg != '') {   
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
              drug = body.data ;
              if(err) throw err;
            if (body.response.Status =='Success') {  
                resp.render('edit_drug',{
                    title: 'Edit Information',
                    sub_title: 'Update Drug',
                    error_msg: error_msg, 
                    drug:  body.data    
                });
    
            }
          });
    } else {

        request({
            headers: {
                'AccessToken': accessToken
            },
            url: baseUrl+"/Drug/UpdateDrug",
            method: 'POST',
            body:{
                "id":id,
                "name":name,
                "brand":brand,
                "category":category,
                "volume":100,
                "qty":1,
                "status":"status"
            },
            json: true
          }, function (err, res, body) {
            if(err) throw err;
            // console.log(body); 
            if (body.response.Status =='Fail') {
                error_msg = 'Error! Please try again.';
                resp.render('edit_drug',{error_msg: error_msg, drug: drug, sub_title: 'Update Drug', title: 'Edit Information'});
            }else{
                resp.render('edit_drug',{success_msg: body.response.Details, drug: drug, sub_title: 'Update Drug', title: 'Edit Information'});
            }
          });

    }
}

// Delete Drug
exports.deleteDrug = (req, resp) => {
    const id = req.params.id;
    const status = 'Deleted';
    var accessToken = req.cookies.accessToken;

    request({
        headers: {
            'AccessToken': accessToken
        }, 
        url: baseUrl+"/Drug/SetDrugStatus",
        method: 'POST',
        body:{
            "id":id,
            "status":status  
        },
        json: true
      }, function (err, res, body) {
        if(err) throw err;
        if (body.Status =='Success') {
            // get drug list 
            request({
                headers: {
                    'AccessToken': accessToken
                },
                url: baseUrl+"/Drug/DrugList",
                method: 'GET',
                json: true
              }, function (err, res, body_druglist) {
                resp.render('view_drugs',{delete_msg: 'Drug item deleted successfully.', druglist: body_druglist.data, accessToken: accessToken, sub_title: 'View Drugs', title: 'View Information'});
              });

        }
    });

}
const request = require('request');
const baseUrl = require('../config/key').baseUrl;

exports.addBrand = (req, resp) => {
    const { brand } = req.body;
    var error_msg = '';
    var accessToken = req.cookies.accessToken;

    //------------ Checking required fields ------------//
    if (!brand) {
        error_msg = 'Please fill required fields.';
    }

    if (error_msg != '') {
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
        resp.render('basic_data', {
            title: 'Settings', sub_title: 'Basic Data', error_msg: error_msg, brandlist: brandlist.data, catlist: catlist.data 
        });
    });
    });

    } else {
        // save brand 
        request({
            headers: {
                'AccessToken': accessToken
            },
            url: baseUrl+"/basic/SaveBrand",
            method: 'POST',
            body:{
                "brand_name":brand
            },
            json: true
          }, function (err, res, body) {
            if(err) throw err;

// ****************************************************************************************************************
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
// *****************************************************************************************************************

            if (body.response.Status =='Fail') {
                resp.render('basic_data',{error_msg: body.response.Details, brandlist: brandlist.data, catlist: catlist.data, sub_title: 'Basic Data', title: 'Settings'});
            }else{
                resp.render('basic_data',{success_msg: 'Brand saved successfully.', brandlist: brandlist.data, catlist: catlist.data, sub_title: 'Basic Data', title: 'Settings'});
            }

        });
    });
          });

    }
}

exports.addCategory = (req, resp) => {
    const { category } = req.body;
    var error_msg = '';
    var accessToken = req.cookies.accessToken;

    //------------ Checking required fields ------------//
    if (!category) {
        error_msg = 'Please fill required fields.';
    }

    if (error_msg != '') {
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
        resp.render('basic_data', {
            title: 'Settings', sub_title: 'Basic Data', error_msg: error_msg, brandlist: brandlist.data, catlist: catlist.data 
        });

    });
    });

    } else {
        // save cat 
        request({
            headers: {
                'AccessToken': accessToken
            },
            url: baseUrl+"/basic/Savecategory",
            method: 'POST',
            body:{
                "Category_name": category
            },
            json: true
          }, function (err, res, body) {
            if(err) throw err;

// ****************************************************************************************************************
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
// *****************************************************************************************************************

            if (body.response.Status =='Fail') {
                resp.render('basic_data',{error_msg: body.response.Details, brandlist: brandlist.data, catlist: catlist.data, sub_title: 'Basic Data', title: 'Settings'});
            }else{
                resp.render('basic_data',{success_msg: 'Category saved successfully.', brandlist: brandlist.data, catlist: catlist.data, sub_title: 'Basic Data', title: 'Settings'});
            }

            });
        });

          });

    }
}


exports.setURL = (req, resp) => {
    const { url } = req.body;
    var error_msg = '';
    var accessToken = req.cookies.accessToken;

    //------------ Checking required fields ------------//
    if (!url) {
        error_msg = 'Please fill required fields.';
    }

    if (error_msg != '') {
        resp.render('basic_data', {
            title: 'Settings', sub_title: 'Basic Data', error_msg: error_msg 
        });
    } else {
        // update URL 
        request({
            headers: {
                'AccessToken': accessToken
            },
            url: baseUrl+"/basic/SetURL",
            method: 'POST',
            body:{
                "url": url
            },
            json: true
          }, function (err, res, body) {
            if(err) throw err;
// ****************************************************************************************************************
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
// *****************************************************************************************************************

            if (body.response.Status =='Success') {
                resp.render('basic_data',{success_msg: body.response.Details, brandlist: brandlist.data, catlist: catlist.data, sub_title: 'Basic Data', title: 'Settings'});
            }else{
                resp.render('basic_data',{error_msg: 'Error! Please try again.', brandlist: brandlist.data, catlist: catlist.data, sub_title: 'Basic Data', title: 'Settings'});
            }
        });
    });
          });

    }
}

// Change Brand Status
exports.setBrandStatus = (req, resp) => {
    const id = req.params.id;
    const status = req.params.status; 
    var accessToken = req.cookies.accessToken;

    request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/basic/SetBrandStatus",
        method: 'POST',
        body:{
            "id":id,
            "Status":status  
        },
        json: true
      }, function (err, res, body) {
        if(err) throw err;
        console.log(body); 
        if (body.response.Status =='Success') {

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
                    resp.render('basic_data',{success_msg: body.response.Details, brandlist: brandlist.data, catlist: catlist.data ,sub_title: 'Basic Data', title: 'Settings'});
                });
            });

            
        }
    });

}

// Change Cat Status
exports.setCatStatus = (req, resp) => {
    const id = req.params.id;
    const status = req.params.status; 
    var accessToken = req.cookies.accessToken;

    request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/basic/SetCategoryStatus",
        method: 'POST',
        body:{
            "id":id,
            "Status":status  
        },
        json: true
      }, function (err, res, body) {
        if(err) throw err;
        console.log(body); 
        if (body.response.Status =='Success') {

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
                    resp.render('basic_data',{success_msg: body.response.Details, brandlist: brandlist.data, catlist: catlist.data ,sub_title: 'Basic Data', title: 'Settings'});
                });
            });

            
        }
    });

}
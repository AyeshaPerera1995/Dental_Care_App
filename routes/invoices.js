const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');
const request = require('request');
const baseUrl = require('../config/key').baseUrl;
const moment = require('moment');

//------------ Importing Controllers ------------//
const invoiceController = require('../controllers/invoiceController');

router.get('/view_invoices', ensureAuthenticated, function(req,resp){
    var accessToken = req.cookies.accessToken;

    // get credit customers 
    request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/Invoice/GetCreditInvoiceList",
        method: 'GET',
        json: true
      }, function (err, res, body) {
        if(err) throw err;
        if (body.response.Details =='Authentication Fail') {
            // redirect to login

        }else if(body.response.Status =='Success'){
            resp.render('view_invoices',{
                title: 'View Information',
                sub_title: 'View Invoices',
                invoices_list: body.data,
                start_date: '',
                end_date: '',
                invo_no: '',
                search_by:'credit'  
            });
        }
      }); 
    
});

router.post('/view_invoices', ensureAuthenticated, invoiceController.viewInvoices);

//------------ View Invoices Route ------------//
router.get('/view_single_invoice/:app_id', ensureAuthenticated, function(req,resp){
    const app_id = req.params.app_id;
    const accessToken = req.cookies.accessToken;

    // get invoice by app id
    request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/Invoice/GetInvoiceByAppointmentid?id="+app_id,
        method: 'GET',
        json: true
      }, function (err, res, body) {
        if(err) throw err;
        if (body.response.Details =='Authentication Fail') {
            // redirect to login


        }else if(body.response.Status =='Success'){
            resp.render('view_single_invoice',{
                title: 'View Information',
                sub_title: 'View invoice',
                invoice_data:  body.data,
                accessToken: accessToken     
            });
        }
      }); 
});

//------------ Add Invoice Route ------------//
router.get('/add_invoice/:number&:name&:type&:contact&:id&:patient_id', ensureAuthenticated, (req, res) => {
    const number = req.params.number;
    const name = req.params.name;
    const type = req.params.type;
    const contact = req.params.contact;
    const id = req.params.id;
    const patient_id = req.params.patient_id;

    console.log(contact);

    res.render('add_invoice', {
        title: 'Add Information',
        sub_title: 'New Invoice',
        number: number,
        name: name,
        type: type,
        contact:contact,
        id: id,
        patient_id:patient_id 
    })
});

router.post('/add_invoice', ensureAuthenticated, invoiceController.createInvoice);

router.get('/print_invoice/:app_id', ensureAuthenticated, function(req,resp){
    const app_id = req.params.app_id;
    const accessToken = req.cookies.accessToken;

    // get invoice by app id
    request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/Invoice/GetInvoiceByAppointmentid?id="+app_id,
        method: 'GET',
        json: true
      }, function (err, res, body) {
        if(err) throw err;
        if (body.response.Details =='Authentication Fail') {
            // redirect to login

        }else if(body.response.Status =='Success'){
            var date = moment(body.data.date, "DD-MM-YYYY").format("MMM DD YYYY");
            resp.render('print_invoice',{sub_title: 'Print Invoice', data: body.data, date:date});
        }
      }); 
});

//------------ Payment Route ------------//
router.get('/payment/:list&:number&:name&:type&:contact&:pid', ensureAuthenticated, (req, resp) => {
    var balance_list = JSON.parse(req.params.list);
    const number = req.params.number;
    const name = req.params.name;
    const type = req.params.type;
    const contact = req.params.contact;
    const pid = req.params.pid;

    resp.render('invoice_payment',{title: 'Payment Details', sub_title: 'Invoice Payment', balance_list:balance_list, number: number, name: name, type: type, contact:contact, pid:pid, error_msg: ''});

});

router.post('/payment', ensureAuthenticated, invoiceController.createPayment);

router.get('/view_payments', ensureAuthenticated, function(req,res){
    var accessToken = req.cookies.accessToken;
        res.render('view_payments',{
            title: 'View Information',
            sub_title: 'View Patients',
            accessToken: accessToken,
            delete_msg: ''             
        });
});

module.exports = router;

const request = require('request');
const baseUrl = require('../config/key').baseUrl;
const moment = require('moment');

//------------ Create Invoice ------------//
exports.createInvoice = (req, resp) => {   
    const { id, patient_id, app_number, patient_name, patient_type, contact, druglist, notes, payment_method, total, paid, balance, have_app_date, app_date} = req.body;
    var error_msg = '';
    var appointment_sheduled = 'No';
    var a_date = 'NA';
    var accessToken = req.cookies.accessToken;
    var list_array = [];

    console.log('in');
    console.log(druglist);
    console.log('out');
    list_array = JSON.parse(druglist);

    var date = new Date();
    var invdate = new Date(date.toLocaleString('en-US', { timeZone: "Asia/Colombo"}));
    var diff = date.getTime() - invdate.getTime();
    var convert_date = new Date(date.getTime() - diff);
    var invoiceDate = moment(convert_date, "DD/MM/YYYY, h:mm:ss a").format("DD-MM-YYYY");

    // ------------ Checking required fields ------------//
    if (!payment_method || !total || !paid || !balance) {
        error_msg = 'Please complete all required details.';
    }
    if (have_app_date == 'on' && !app_date) {
        error_msg = 'Please select the Appointment Date';
    }
    if (have_app_date == 'on') {
        appointment_sheduled = 'Yes';
    }
    if (app_date != undefined) {
        a_date = moment(app_date, "YYYY-MM-DD").format("DD-MM-YYYY");
    }

    if (error_msg != '') {
        resp.render('add_invoice', {
            title: 'Add Information', sub_title: 'New Invoice', number: app_number, name: patient_name, type: patient_type, contact:contact, id: id,patient_id:patient_id, error_msg: error_msg 
        });
    }
    else {
        request({
            headers: {
                'AccessToken': accessToken
            },
            url: baseUrl+"/Invoice/CreateInvoice",
            method: 'POST',
            body:{
                "created_by": req.user.user_name,
                "date": invoiceDate,
                "patient_id": patient_id,
                "patient_name": patient_name,
                "appointment_number": app_number,
                "appointment_id": id,
                "other_note": notes,
                "total_amount": total+'.00',
                "paid_amount": paid+'.00',
                "balance": balance,
                "payment_method": payment_method,
                "appointment_sheduled": appointment_sheduled,
                "next_appointment_date": a_date,
                "line_items": list_array
              
            },
            json: true
          }, function (err, res, body) {
            if(err) throw err;
            console.log(body); 
            if (body.response.Status =='Success') {
                var dd = moment(body.data.date, "DD-MM-YYYY").format("MMM DD YYYY");
                resp.render('print_invoice',{sub_title: 'Print Invoice', data: body.data, date:dd});
            }else{
                error_msg = 'Error! Please try again.';
                resp.render('add_invoice',{title: 'Add Information', sub_title: 'New Invoice', number: app_number, name: patient_name, type: patient_type, contact:contact, id: id,patient_id:patient_id, error_msg: error_msg});
            }
          });

    }

}


// create payment
exports.createPayment = (req, resp) => {   
    
    const { pid, invo_number, patient_name, contact, notes, payment_method, total_payable, paid, balance, have_app_date, app_date} = req.body;
    var error_msg = '';
    var appointment_sheduled = 'No';
    var a_date = 'NA';
    var accessToken = req.cookies.accessToken;
    var invo_no = invo_number.split('-')[0];

    var date = new Date();
    var invdate = new Date(date.toLocaleString('en-US', { timeZone: "Asia/Colombo"}));
    var diff = date.getTime() - invdate.getTime();
    var convert_date = new Date(date.getTime() - diff);
    var invoiceDate = moment(convert_date, "DD/MM/YYYY, h:mm:ss a").format("DD-MM-YYYY");

    if (have_app_date == 'on') {
        appointment_sheduled = 'Yes';
    }
    if (app_date != undefined) {
        a_date = moment(app_date, "YYYY-MM-DD").format("DD-MM-YYYY");
    }

        request({
            headers: {
                'AccessToken': accessToken
            },
            url: baseUrl+"/Invoice/CreatePayment",
            method: 'POST',
            body:{
                "created_by": req.user.user_name,
                "date": invoiceDate,
                "invoice_no": invo_no,
                "patient_id": pid,
                // "other_note": notes,
                "total_paid_amount": total_payable+'.00',
                "paid_amount": paid+'.00',
                "balance": balance,
                "payment_method": payment_method,
                "appointment_sheduled": appointment_sheduled,
                "next_appointment_date": a_date
    
            },
            json: true
          }, function (err, res, body) {
            if(err) throw err;
            console.log(body); 
            if (body.response.Status =='Success') {
                var dd = moment(body.data.date, "DD-MM-YYYY").format("MMM DD YYYY");
                resp.render('print_payment',{sub_title: 'Print Payment', data: body.data, date:dd, patient_name:patient_name, contact:contact});
            }
            // else{
            //     error_msg = 'Error! Please try again.';
            //     resp.render('add_invoice',{title: 'Add Information', sub_title: 'New Invoice', number: app_number, name: patient_name, type: patient_type, contact:contact, id: id,patient_id:patient_id, error_msg: error_msg});
            // }
          });
}

exports.viewInvoices = (req, resp) => { 
    var accessToken = req.cookies.accessToken;
    const { search_by, start_date, end_date, invo_no } = req.body;

    var sdate = start_date.split('-')[1]+'/'+start_date.split('-')[2]+'/'+start_date.split('-')[0];
    var edate = end_date.split('-')[1]+'/'+end_date.split('-')[2]+'/'+end_date.split('-')[0];

    console.log(search_by); 
    // console.log(sdate); console.log(edate); console.log(invo_no);

    if (search_by == 'date_range') {
        // console.log('search by date range'); 
         request({
        headers: {
            'AccessToken': accessToken
        },
        url: baseUrl+"/Invoice/GetInvoiceListByDates?from="+sdate+"&to="+edate,
        method: 'GET',
        json: true
      }, function (err, res, body) {
        if(err) throw err;
        if (body.response.Details =='Authentication Fail') {
            // redirect to login

        }else if(body.response.Status =='Success'){
            let invoList = body.data.slice().sort((a, b) => a.id - b.id);
            resp.render('view_invoices',{
                title: 'View Information',
                sub_title: 'View Invoices',
                invoices_list: invoList,
                start_date: start_date,
                end_date: end_date,
                invo_no: '',
                search_by: search_by   
            });
        }
      }); 
    }
    else if (search_by == 'invo_no') {
        // console.log('search by in no'); 
        request({
            headers: {
                'AccessToken': accessToken
            },
            url: baseUrl+"/Invoice/GetInvoiceByInvoiceNo?invoiceNo="+invo_no,
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
                    start_date: start_date,
                    end_date: end_date,
                    invo_no: '',
                    search_by: search_by   
                });
            }
          });
    }
    else if (search_by == 'credit') {
        // console.log('saerch by credit'); 
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
                    search_by: search_by  
                });
            }
        }); 
    }
    
   
}
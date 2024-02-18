const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const passport = require('passport');
var path = require('path');

const app = express();

//------------ Passport Configuration ------------//
require('./config/passport')(passport);

//------------ Express session Configuration ------------//

const time = 1000 * 60 * 60 * 12; //12 hours
app.use(
  session({
      secret: 'secretkeyboarddogfhrgfgrfrty84fwir7679',
      resave: false,
      cookie: { maxAge: time },
      saveUninitialized: true
  })
);

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static((__dirname + '/public')));

// cookie parser middleware
app.use(cookieParser());

//------------ Passport Middlewares ------------//
app.use(passport.initialize());
app.use(passport.session()); 

//------------ Connecting flash ------------//
app.use(flash());

//------------ Global variables ------------//
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.current_user = req.user;
  next();
});

//------------ Routes ------------//
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/patients', require('./routes/patients'));
app.use('/drugs', require('./routes/drugs'));
app.use('/appointments', require('./routes/appointments'));
app.use('/invoices', require('./routes/invoices'));
app.use('/play_videos', require('./routes/play_videos'));
app.use('/basic_data', require('./routes/basic_data'));
app.use('/reports', require('./routes/reports'));

// 404 Error Page handling 
app.get('*', (req, res) =>{
  res.sendFile(__dirname+'/views/404.html');
});

const PORT = process.env.PORT || 3300;
app.listen(PORT, console.log(`Server running on PORT ${PORT}`));
const express = require('express');
const  bodyParser  =  require('body-parser');
const app = express();
const  router  =  express.Router();

router.use(bodyParser.urlencoded({ extended:  false }));
router.use(bodyParser.json());

const appointmentsRoutes = require('./routes/appointments');
const usersRoutes = require('./routes/users');

router.use(bodyParser.urlencoded({ extended:  false }));
router.use(bodyParser.json());

app.use('/appointments', appointmentsRoutes);
app.use('/users', usersRoutes);


module.exports = app;

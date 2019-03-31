const express = require('express');
const bodyParser = require('body-parser');


const db = require('./../db');
const router = express.Router();
const  bcrypt  =  require('bcryptjs');
const  jwt  =  require('jsonwebtoken');

router.use(bodyParser.urlencoded({ extended:  false }));
router.use(bodyParser.json());

//ATTENTION!
//This is only for demo. Keep the secret key hidden and
// store the password within an environment variable
const SECRET_KEY = "P@ssw0rd001";



//Get events by user-id
router.get('/:userId', (req, res, next) => {
    console.log("Get")

    const userId = req.params.userId;
    db.all(`SELECT * FROM Appointments
      WHERE userId="${userId}"`,
        (err, result) =>{
         if (typeof result ===  'undefined') {
             res.header("Access-Control-Allow-Origin", "*").status("204").json({
              message: "No result"
            });
        } else {

             res.header("Access-Control-Allow-Origin", "*").status("200").json({
            result
        });
      }
    }
  );
});

router.post('/', (req, res, next) => {
    console.log("Post");


    const userId = req.body.userId;
    const title = req.body.title;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const priority = req.body.priority;
    const color = req.body.color;



    createNewAppointment([userId, title, startDate, endDate, priority, color], (err, row) => {

        res.header("Access-Control-Allow-Origin", "*").status("200").json({"appointment":  row});


    });


//Put events by event id
router.put('/', (req, res, next) => {
    console.log("Put")

    const userId = req.body.userId;
    const title = req.body.dateBegin;
    const startDate = req.body.dateEnd;
    const endDate = req.body.timeBegin;
    const priority = req.body.timeEnd;
    const color = req.body.subject;


    db.get("UPDATE Appointments SET " +
        "userId = ?, " +
        "title = ?, " +
        "startDate = ?, " +
        "endDate = ?, " +
        "priority = ?," +
        "color = ?, " +

        "WHERE appointmentID = ?", userId, title, startDate,  endDate, priority, color, (err, appointment) => {

        res.header("Access-Control-Allow-Origin", "*").status("200").send({
            message: "Appointment updated"
        });

    });



});

//Deletes a appointment
router.delete('/:appointmentId', (req, res, next) => {
    const id = req.params.id;

    db.get('DELETE FROM Appointments WHERE id = ?', id, (err, row) => {
        console.log(err);
        if(err){

            res.header("Access-Control-Allow-Origin", "*").status("500").json({
                message: "Server error"
            });
        }else {
            res.header("Access-Control-Allow-Origin", "*").status("200").json({
                message: "Appointment deleted"
            });
        }


    })
});



});


//to test the JWT
/*
router.get('/protectionTest', verifyToken, (req, res) => {
    console.log("protection")
    jwt.verify(req.token, SECRET_KEY, (err, data) => {
        if(err){
            res.send("403").json({
                message: "Forbidden"
            });
        }else {
            res.status("200").json({
                message: "Ok"
            })
        }
    })


});
*/



//Create a new appointment in the db

function createNewAppointment(appointment, cb) {
   return db.get('INSERT INTO Appointments ("userId","title","startDate", "endDate","priority","color") VALUES (?,?,?,?,?,?)',
         appointment,(err, appointment) =>{

            cb(err,appointment);

        });


}

/*
//Function modifies the token
function verifyToken(req, res, next){
    const beHeader = req.headers['authorization'];
    if(typeof beHeader !== 'undefined'){
        const  bearer = beHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next()
    }else {
        res.header("Access-Control-Allow-Origin", "*").status(401).send('Access denied')
    }
}
*/



module.exports = router;

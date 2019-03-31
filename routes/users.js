const express = require('express');
const bodyParser = require('body-parser');

const db = require('../db');

const router = express.Router();
const  bcrypt  =  require('bcryptjs');
const  jwt  =  require('jsonwebtoken');

//ATTENTION!
//This is only for demo. Keep the secret key hidden and
// store the password within an environment variable
const SECRET_KEY = "P@ssw0rd001";


router.use(bodyParser.urlencoded({ extended:  false }));
router.use(bodyParser.json());


//Login
router.get('/', (req, res, next) => {
  const email = req.query.email;
  const password = req.query.password;
  db.all(`SELECT * FROM Users 
    WHERE email="${email}" AND password="${password}"`, 
    (err, result) => {
      if (err) {
        console.log(err);
      }
      if (typeof result === 'undefined') {
        res.status("204").json({
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

//Register
router.post('/', (req, res, next) => {
  const email = req.query.email;
  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  const password = req.query.password;



  db.run(`INSERT INTO Users (email, firstname, lastname, password) 
    VALUES ("${email}", "${firstname}","${lastname}","${password}")`,
    (err, result) => {
        res.header("Access-Control-Allow-Origin", "*");
      console.log(result);
      console.log(err);
      if (err == null) {
        res.status("200").json({
          status: 1000
        });
      } else {
        console.log(err);
        res.status("500").json({
          err
        });
      }
    }
  )


});




router.post('/register', (req, res, next) => {

    const email  =  req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const  password  =  bcrypt.hashSync(req.body.password);


    db.get(`SELECT * FROM users WHERE email = ?`, email,(err, row)=> {

        console.log(row);

        if (typeof row === 'undefined'){

            createUser([email,firstname, lastname, password] , (err, user) => {
                if(err){
                    res.header("Access-Control-Allow-Origin", "*").status("500").json({
                        message: "Server error"
                    })
                }


                const  expiresIn  =  24  *  60  *  60;
                const  accessToken  =  jwt.sign({ id:  user.userID }, SECRET_KEY, { //user.id
                    expiresIn:  expiresIn
                });

                res.header("Access-Control-Allow-Origin", "*").status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn
                });

            } )
        }else {
            res.header("Access-Control-Allow-Origin", "*").status(200).json({
                message: "User already exists"
            });
        }

            });

});


//This route is for jwt
router.post('/login', (req, res) => {
    const  email  =  req.body.email;
    const  password  =  req.body.password;

    findUserByEmail(email, (err, user)=>{

        console.log(user);


        if(err){
            res.status("500").json({
                message: "Server error"
            });
        }

        if(typeof user === 'undefined'){
            res.status("404").json({
                message: "User not found"
            });
        }

        const  result  =  bcrypt.compareSync(password, user.password);
        if(!result) return  res.status(401).send('Password not valid!');

        const  expiresIn  =  24  *  60  *  60;
        const  accessToken  =  jwt.sign({ id:  user.id }, SECRET_KEY, {
            expiresIn:  expiresIn
        });
        res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn});
    });


});




//Create a new User
function createUser(user, cb){
    return  db.get(`INSERT INTO Users (email, firstname, lastname, password) 
    VALUES (?,?,?,?)`,user, (err, row) => {
        console.log(err);
        cb(err, user);
    });


}

//Fetches a user by email
function  findUserByEmail (email, cb) {
    return  db.get(`SELECT * FROM Users WHERE email = ?`,[email], (err, row) => {
        cb(err, row)
    });
}


module.exports = router;

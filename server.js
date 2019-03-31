const http = require('http');
const app = require ('./app');

const  jwt  =  require('jsonwebtoken');
const  bcrypt  =  require('bcryptjs');

//This is for demo only
const SECRET_KEY = "secretKey";


const port = process.env.PORT ||  1701

const server = http.createServer(app);

server.listen(port);

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();

const multer = require('multer');
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const login = require('./callbacks/login');
const register = require('./callbacks/register');
const orders = require('./callbacks/orders');
const comments = require('./callbacks/comments');


// Parsers
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  limit: "10mb",
  extended: true
}));
app.use(bodyParser.json({limit: "10mb"}));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


app.get('/api/orders', orders.get);
app.post('/api/order', orders.postOrder);

app.get('/api/comments', comments.get);
app.post('/api/comments', comments.post);

app.post('/api/login', login.post);
app.post('/api/register', register.post);

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));

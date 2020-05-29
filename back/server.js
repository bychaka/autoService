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

//TODO: check upload file mimeType
// const fileFilter = (req, file, cb) => {
//   // reject a file
//   if (file.mimeType === 'image/jpeg' || file.mimeType === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const upload = multer({ storage });

// const en = require('./../dist/Minsk/assets/i18n/en');
// const ru = require('./../dist/Minsk/assets/i18n/ru');

const employees = require('./callbacks/employees');
const maps = require('./callbacks/maps');
const permissions = require('./callbacks/permissions');
const versions = require('./callbacks/versions');
const login = require('./callbacks/login');
const register = require('./callbacks/register');
const themes = require('./callbacks/themes');
const orders = require('./callbacks/orders');


// Parsers
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  limit: "10mb",
  extended: true
}));
app.use(bodyParser.json({limit: "10mb"}));

// Angular DIST output folder
// app.use(express.static(path.join(__dirname, './../dist/Minsk')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// app.get('/en', (req, res) => {
//   res.end(JSON.stringify(en));
// });
//
// app.get('/ru', (req, res) => {
//   res.end(JSON.stringify(ru));
// });

app.get('/api/orders', orders.get);
app.post('/api/order', orders.postOrder);

// app.get('/api/employees', employees.get);
// app.get('/api/update-employees', employees.updateList);
//
// app.get('/api/permissions', permissions.get);
//
// app.get('/api/employees/city', maps.getUnits);
// app.post('/api/employees/city', maps.postUnits);
//
// app.get('/api/minsk', maps.getMinsk);
// app.post('/api/minsk', maps.postMinsk);
//
// app.post('/api/get-current-map', maps.getMap);
// app.post('/api/get-current-map-link', maps.getMapLink);
// app.get('/api/get-maps', maps.getMapsList);
// app.post('/api/upload-map', upload.single('map-image'), maps.uploadMap);
// app.post('/api/set-map-info', maps.setMapInfoInDB);
// app.get('/api/get-maps-count', maps.getMapsCount);
//
// app.post('/api/check-version', versions.check);

app.post('/api/login', login.post);
app.post('/api/register', register.post);

// app.post('/api/theme', themes.postTheme);
// app.get('/api/theme', themes.getThemes);
// app.post('/api/upload-theme', upload.single('theme-file'), themes.uploadTheme);

// Send all other requests to the Angular app
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, './../dist/Minsk/index.html'));
// });

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));

const dbSingleton = require('./../mongo');
const fs = require('fs');
const dbInstance = new dbSingleton();

function postTheme(req, res) {
  if (req.body) {
    const theme = req.body;
    const db = dbInstance.getDd();
    const dbBody = {
      primary: theme.primary,
      secondary: theme.secondary,
      searchInputColor: theme.searchInputColor,
      animationEmployee: theme.animationEmployee,
      name: theme.name,
    };
    db.collection('themes').insertOne(dbBody).then(()=>{
      db.collection('themes').find(dbBody.name).toArray((error, result) => {
        if (error) {
          res.statusCode = 404;
          res.end(JSON.stringify(error));
          return;
        }
        res.statusCode = 200;
        res.end(JSON.stringify(result));
      })
    })
  }
}

function getThemes(req, res){
  const db = dbInstance.getDd();
  db.collection('themes').find().toArray((err, result) => {
    if (err) {
      res.statusCode = 404;
      res.end(JSON.stringify(err));
      return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  });
}


function uploadTheme(req, res){
  const theme = req.file;
  const db = dbInstance.getDd();
  fs.readFile(theme.path, 'utf8', function (err, data) {
    if (err) throw  res.end("Upload error");
    try {
    let dbBody = JSON.parse(data);
    db.collection('themes').insertOne(dbBody).then(()=>{
      db.collection('themes').findOne(
        {},
        {sort: {$natural:-1} },
        (err, data) => {
          if (err) {
            res.statusCode = 404;
            res.end(JSON.stringify(err));
            return;
          }
          res.statusCode = 200;
          res.end(JSON.stringify(data));
        })
    })
    } catch (error) {
      res.end(error);
    }
  });
}

module.exports = {
  postTheme,
  getThemes,
  uploadTheme,
};

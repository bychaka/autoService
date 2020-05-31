const dbSingleton = require('./../mongo');
const dbInstance = new dbSingleton();


function get(req, res) {
  const db = dbInstance.getDd();
  if (req.query.id) {
    db.collection('comments').find({"userId": req.query.id}).toArray((err, result) => {
      if (err) {
        res.statusCode = 404;
        res.end(JSON.stringify(err));
        return;
      }
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    });
    return;
  }
  db.collection('comments').find().toArray((err, result) => {
    if (err) {
      res.statusCode = 404;
      res.end(JSON.stringify(err));
      return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  });
}

function post(req, res) {
  const comment = req.body;
  const db = dbInstance.getDd();
  db.collection('comments').insertOne(comment).then(()=>{
    res.statusCode = 200;
    res.end(JSON.stringify(true));
  }).catch( err =>{
    res.statusCode = 404;
    res.end(JSON.stringify(err));
  });
}

module.exports = {
  get,
  post
};

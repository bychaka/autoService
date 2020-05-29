const dbSingleton = require('./../mongo');
const dbInstance = new dbSingleton();

function get(req, res) {
  const db = dbInstance.getDd();
  db.collection('permissions').find().toArray((err, result) => {
    if (err) {
      res.statusCode = 404;
      res.end(JSON.stringify(err));
      return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(result[0]));
  });
}

module.exports = {
  get,
};

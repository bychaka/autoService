const dbSingleton = require('./../mongo');
const dbInstance = new dbSingleton();

function check(req, res) {
  if (req.body.version) {
    const db = dbInstance.getDd();
    db.collection('version_log').find({'version': req.body.version}).toArray((err, result) => {
      if (err) {
        res.statusCode = 404;
        res.end(JSON.stringify(err));
        return;
      }
      res.statusCode = 200;
      res.end(JSON.stringify(`${result[0].versionDescription}`));
    });
  }
}

module.exports = {
  check,
};

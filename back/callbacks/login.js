const dbSingleton = require('./../mongo');
const dbInstance = new dbSingleton();

function post(req, res) {
  console.log(req);
  const db = dbInstance.getDd();
  const { email, password } = req.body;
  db.collection('users').findOne({email: email, password: password}).then((item) => {
    console.log('ITEM',item);
    if (item) {
      res.statusCode = 200;
      res.end(JSON.stringify(item));
      return;
    }
    res.statusCode = 404;
    res.end(JSON.stringify({error: false}));
  });
}

module.exports = {
  post,
};

const dbSingleton = require('./../mongo');
const dbInstance = new dbSingleton();

function post(req, res) {
  console.log(req);
  const db = dbInstance.getDd();
  const user = req.body;
  db.collection('users').findOne({email: user.email}).then((item) => {
    console.log('ITEM',item);
    if (item) {
      res.statusCode = 404;
      res.end(JSON.stringify({error: 'login exists'}));
    } else {
      user.role = 'USER';
      db.collection('users').insertOne(user).then(()=>{
        db.collection('users').findOne({email: user.email}).then((newUser) => {
          res.statusCode = 200;
          res.end(JSON.stringify(newUser));
        });
      });
    }
  });
}

module.exports = {
  post,
};

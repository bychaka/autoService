const dbSingleton = require('./../mongo');
const dbInstance = new dbSingleton();
ObjectId = require('mongodb').ObjectID;


function get(req, res) {
    const db = dbInstance.getDd();
    if (req.query.email) {
      console.log(req.query.email);
      db.collection('orders').find({"email": req.query.email}).toArray((err, result) => {
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
    db.collection('orders').find().toArray((err, result) => {
      if (err) {
        res.statusCode = 404;
        res.end(JSON.stringify(err));
        return;
      }
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    });
  }

function postOrder(req, res) {
  if (req.body) {
    const order = req.body;
    order._id = ObjectId(order._id);
    const db = dbInstance.getDd();
    db.collection('orders').save(order).then(()=>{
      db.collection('orders').find().toArray((error, result) => {
        console.log(error);
        console.log(result);
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

module.exports = {
  get,
  postOrder
};

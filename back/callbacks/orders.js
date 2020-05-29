const dbSingleton = require('./../mongo');
const dbInstance = new dbSingleton();


function get(req, res) {
    const db = dbInstance.getDd();
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
    const db = dbInstance.getDd();
    const dbBody = {
      category: order.category,
      author: order.author,
      title: order.title,
      price: order.price
    };
    db.collection('orders').insertOne(dbBody).then(()=>{
      db.collection('orders').find({category: 'reference'}).toArray((error, result) => {
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

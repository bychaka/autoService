const MongoClient = require('mongodb').MongoClient;

const config = require('./config');

let db;

module.exports = class DBSingleton {
  constructor() {
    if (!db) {
      MongoClient.connect(config.db.url, { useNewUrlParser: true }, (err, database) => {
        if (err) return console.error(err);

        db = database.db(config.db.name);
      });
    }
  }

  getDd() {
    return db;
  }
};

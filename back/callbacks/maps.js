const dbSingleton = require('./../mongo');
const ObjectId = require('mongodb').ObjectID;
const dbInstance = new dbSingleton();
const { getCityId } = require('./accessory-functions');

const MAPS_LIST = [
  {
    id: '0',
    name: 'minsk',
    link: 'public/minsk.png',
  },
  {
    id: '1',
    name: 'grodno',
    link: 'public/grodno.png',
  },
  {
    id: '2',
    name: 'vienna',
    link: 'public/vienna.png',
  },
  {
    id: '3',
    name: 'munich',
    link: 'public/munich.png',
  },
  {
    id: '4',
    name: 'amsterdam',
    link: 'public/amsterdam.png',
  },
  {
    id: '42',
    name: 'other',
    link: 'public/other.png',
  },
];

function postUnits(req, res) {
  console.time('Time execution with console.time');
  if (req.body.newData) {
    const data = req.body.newData;
    const cityId = req.body.cityId;
    const db = dbInstance.getDd();
    db.collection('units').deleteMany({cityId: cityId}).then(() => {
      db.collection('units').insertMany(data).then(() => {
        db.collection('units').find({cityId: cityId}).toArray((err, result) => {
          if (err) {
            res.statusCode = 404;
            res.end(JSON.stringify(err));
            return;
          }
          res.statusCode = 200;
          res.end(JSON.stringify(result));
        });
      });
    });
  } else {
    res.statusCode = 404;
    res.end("newData not found!");
    return;
  }
  console.timeEnd('Time execution with console.time');
}

function getMinsk(req, res) {
  const db = dbInstance.getDd();
  db.collection('minsk').find().toArray((err, result) => {
    if (err) {
      res.statusCode = 404;
      res.end(JSON.stringify(err));
      return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  });
}

function getUnitsFromCity(city){
  return new Promise((resolve, reject) => {
    const db = dbInstance.getDd();
    if (city != null) {
      db.collection('units').find({cityId: city}).toArray((err, result) => {
      if (err) {
        reject(`failed to find units of cityId ${city}, ${!err}`);
      }
      resolve(result);
    });
    } else {
      db.collection('units').find().toArray((err, result) => {
        if (err) {
          reject(`failed to find units, ${!err}`);
        }
        resolve(result);
      });
    }
  })
}

function getEmployees() {
  return new Promise((resolve, reject) => {
    const db = dbInstance.getDd();
    db.collection('employees').find().toArray((err, result) => {
      if (err) {
        reject(`failed to find employees, ${!err}`);
      }
      resolve(result);
    });
  })
}

function findEmployeeInUnits(employee, units){
  return units.find(item => {
    return item.employeeId ? employee.id === item.employeeId : false;
  });
}

function getCoords(employees, cityId){
  return new Promise((resolve, reject) => {
    const db = dbInstance.getDd();
    if (cityId === null){
      db.collection('units').find().toArray((err, units) =>{
        if (err) reject(`error in cityId = ${cityId}, ${err}`);
        const withCoords = employees.map((employee)=>{
          let existEmployeeUnit = findEmployeeInUnits(employee, units);
          if (existEmployeeUnit){
            employee.x = existEmployeeUnit.x;
            employee.y = existEmployeeUnit.y;
            employee.cityId = existEmployeeUnit.cityId;
            return employee;
          }
          employee.x = null;
          employee.y = null;
          employee.cityId = getCityId(employee);
          return employee;
        });
        resolve(withCoords);
      });
      return;
    }
    db.collection('units').find({cityId: cityId}).toArray((err, units) =>{
      if (err) reject(`error in cityId = ${cityId}, ${err}`);
      const withCoords = employees.map((employee)=>{
        let existEmployeeUnit = findEmployeeInUnits(employee, units);
        if (existEmployeeUnit){
          employee.x = existEmployeeUnit.x;
          employee.y = existEmployeeUnit.y;
          employee.cityId = existEmployeeUnit.cityId;
          return employee;
        } else if (getCityId(employee) === cityId) {
          employee.x = null;
          employee.y = null;
          employee.cityId = cityId;
          return employee;
        }
        return null;
      });
      const result = withCoords.filter(element => element !== null);
      resolve(result);
    })
  })
}

function getUnits(req, res) {
  if (req.query.id) {
    const map = MAPS_LIST.find(item => item.id === req.query.id);
    if (map) {
      const cityId = parseInt(map.id, 10);
      getEmployees()
        .then((employees) => getCoords(employees, cityId))
        .then(result => {
          res.statusCode = 200;
          res.end(JSON.stringify(result))
        })
        .catch(error => {
          console.error(`error in ${map.name}`, error);
          res.status(500).end();
        });

    } else {
      res.statusCode = 404;
      res.end(JSON.stringify(`cityId = ${req.query.id} not found`));
    }
  } else {
    getEmployees()
      .then((employees) => getCoords(employees, null))
      .then(result => {
        res.statusCode = 200;
        res.end(JSON.stringify(result))
      })
      .catch(error => {
        console.error("all units error", error);
        res.status(500).end();
      });
  }
}

function postMinsk(req, res) {
  if (req.body.newData) {
    const db = dbInstance.getDd();
    db.collection('minsk').deleteMany({}).then(() => {
      db.collection('minsk').insertMany(req.body.newData).then(() => {
        db.collection('minsk').find().toArray((err, result) => {
          if (err) {
            res.statusCode = 404;
            res.end(JSON.stringify(err));
            return;
          }
          res.statusCode = 200;
          res.end(JSON.stringify(result));
        });
      });
    });
  }
}

function getMap(req, res) {
  if (req.body.id) {
    MAPS_LIST.filter((map) => {
      if (map.id === req.body.id) {
        const city = parseInt(map.id, 10);
        getUnitsFromCity(city)
          .then(result => {
            res.statusCode = 200;
            res.end(JSON.stringify(result))})
          .catch(error => {
            console.error(`units error in ${map.name}`, error);
            res.status(500).end();
          });
      }
    });
  }
}

function getMapLink(req, res) {
  if (req.body.id) {
    MAPS_LIST.filter((map) => {
      if (map.id === req.body.id) {
        res.end(JSON.stringify(map.link));
      }
    });
  }
}

function getMapsList(req, res) {
  res.end(JSON.stringify(MAPS_LIST));
}

function uploadMap(req, res) {
  if (req.file) {
    res.end('true');
  } else {
    res.end('false');
  }
}

function setMapInfoInDB(req, res) {
  if (req.body) {
    const map = req.body;
    const db = dbInstance.getDd();
    const dbBody = {
      name: map.name,
      index: map.index,
      link: map.link,
      x: map.x,
      y: map.y
    };
    db.collection('mapsList').insertOne(dbBody).then(() => {
      db.collection('mapsList').find(dbBody.index).toArray((error, result) => {
        if (error) {
          res.statusCode = 404;
          res.end(JSON.stringify(error));
          return;
        }
        res.statusCode = 200;
        res.end(JSON.stringify(result));
      });
    });
  }
}

function getMapsCount(req, res) {
  const db = dbInstance.getDd();
  db.collection('mapsList').countDocuments({}).then((result) => {
    if (result) {
      res.end(JSON.stringify(result));
    }
  });
}

module.exports = {
  getUnits,
  postUnits,
  getMinsk,
  postMinsk,
  getMap,
  getMapsList,
  getMapLink,
  uploadMap,
  setMapInfoInDB,
  getMapsCount,
};

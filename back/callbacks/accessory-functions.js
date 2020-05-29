const dbSingleton = require('./../mongo');
const dbInstance = new dbSingleton();
const Locations = {
  Minsk: 0,
  Grodno: 1,
  Vienna: 2,
  Munich: 3,
};

function convertEmployeesToEmployeeArrayModel(receivedEmployees) {
  const employees = [];
  receivedEmployees.forEach((item) => {
    employees.push({
      firstName: getValue(item, 'firstName'),
      lastName: getValue(item, 'lastName'),
      jobTitle: getValue(item, 'jobTitle'),
      department: getValue(item, 'department'),
      division: getValue(item, 'division'),
      email: getValue(item, 'workEmail'),
      location: getValue(item, 'location'),
      imgUrl: getValue(item, 'photoUrl'),
      workPhone: getValue(item, 'workPhone'),
      personalPhone: getValue(item, 'mobilePhone'),
      id: item.id,
      linkedInUrl: getValue(item, 'linkedIn'),
      facebookUrl: getValue(item, 'facebook'),
      skype: getValue(item, 'skypeUsername'),
    });
  });
  employees.push({
    "firstName" : "Vladimir",
    "lastName" : "Supply manager",
    "jobTitle" : "Supply manager",
    "department" : "SPG BY",
    "division" : "SPG BY",
    "email" : null,
    "location" : "Minsk",
    "imgUrl" : "https://mircarfinder.ru/assets/default_user_logo-6fcfb19c5976d0f4763f8a183c4f57e872705a32eb12d441eb150fa7bd0aedc3.png",
    "workPhone" : null,
    "personalPhone" : null,
    "id" : "1111",
    "linkedInUrl" : null,
    "facebookUrl" : null,
    "skype" : null
  });
  return employees;
}

function getCityId(employee) {
  let location = employee.location;
  return (location && Locations[location]!==undefined) ? Locations[location] : null;
}

function getValue(employee, field) {
  let value = '';
  employee.field.forEach((row) => {
    if (row.id.includes(field)) {
      value = row.$t;
    }
  });
  return value;
}

function getOldData(){
  return new Promise((resolve) => {
    const db = dbInstance.getDd();
    db.collection('minsk').find().toArray((err, result) => {
      if (err) {
        resolve(!err);
      }
      resolve(result);
    });
  });
}

function mergeData(employees){
  return new Promise((resolve) => {
    const db = dbInstance.getDd();
    getOldData().then(result => {
      if (result) {
        const withEmp = result.map(oldItem => {
          if (!oldItem.hasOwnProperty('employee')) {
            delete oldItem.type;
            delete oldItem._id;
            oldItem['cityId'] = 0;
            return oldItem;
          }
          const actualItem = employees.find(item => item.id.toString() === oldItem.employee.id.toString());
              if (actualItem){
                return {
                  x: oldItem.x,
                  y: oldItem.y,
                  cityId: 0,
                  employeeId: actualItem.id,
                };
              }
              else return oldItem;
        });
        db.collection('units').deleteMany({}).then(() => {
          db.collection('units').insertMany([...withEmp]).then(() => {
            db.collection('units').find().toArray((err) => resolve(!err));
          });
        });
      }
    });
  })
}

function setNewEmployeesDataInDB(employees) {
  return new Promise((resolve) => {
    const db = dbInstance.getDd();
    db.collection('employees').deleteMany({}).then(() => {
      db.collection('employees').insertMany(employees).catch(err => console.error(`error: ${err}`));
    });
    db.listCollections().toArray(function(err, listCollections) {
      const collection = listCollections.find((map) => map.name === 'units');
      if (Boolean(collection)) {
        mergeData(employees).then(result => resolve(result)).catch(err => console.error(`error: ${err}`));
      } else {
        db.createCollection('units');
        mergeData(employees).then(result => resolve(result)).catch(err => console.error(`error: ${err}`));
      }
    });
  });
}

module.exports = {
  convertEmployeesToEmployeeArrayModel,
  setNewEmployeesDataInDB,
  getCityId,
};

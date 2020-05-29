const dbSingleton = require('./../mongo');
const dbInstance = new dbSingleton();
const axios = require('axios');
const parser = require('xml2json');
const { convertEmployeesToEmployeeArrayModel, setNewEmployeesDataInDB } = require('./accessory-functions');

function get(req, res) {
  const db = dbInstance.getDd();
  db.collection('employees').find().toArray((err, result) => {
    if (err) {
      res.statusCode = 404;
      res.end(JSON.stringify(err));
      return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  });
}

function updateList(req, res) {
  axios.get('https://79d82b5017c7c8ec2dcd96e01be03da4436040bc:x@api.bamboohr.com/api/gateway.php/specificgroup' +
    '/v1/employees/directory')
    .then((response) => {
      const jsonResponse = parser.toJson(response.data);
      const employees = convertEmployeesToEmployeeArrayModel(JSON.parse(jsonResponse).directory.employees.employee);
      if (employees && employees.length > 0) {
        setNewEmployeesDataInDB(employees)
          .then((result) => {
            res.end(JSON.stringify(result));
          });
      }
    })
    .catch((error) => {
      res.end(JSON.stringify(error));
    });
}

module.exports = {
  get,
  updateList,
};

var promise = require('bluebird');
var configbd = require('../configdb');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = configbd.connectionString;
var db = pgp(connectionString);

function getAllCategorias(req, res, next) {
  db.any('select * from categorias')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Se obtuvieron todas las categorias'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllCategorias: getAllCategorias
};
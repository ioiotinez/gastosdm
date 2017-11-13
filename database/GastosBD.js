var promise = require('bluebird');
var configbd = require('../configdb');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = configbd.connectionString;
var db = pgp(connectionString);

function getAllGastos(req, res, next) {
  db.any('select g.*, c.nombre as nombrecategoria from gastos g join categorias c on c.id = g.idcategoria')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Se obtuvieron todos los gastos'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getLastGastos(req, res, next){
  db.any('select  g.*, c.nombre as nombrecategoria from gastos g join categorias c on c.id = g.idcategoria order by fecha desc, id desc limit 4')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Se obtuvieron todos los gastos'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createGasto(req, res, next) {
  db.one('insert into gastos(idcategoria, descripcion, fecha, monto)' +
      'values(${categoria}, ${descripcion}, ${fecha}, ${monto}) RETURNING id',
    req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          inserterdId: data.id,
          message: 'Inserted one gasto'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function deleteGasto(req, res, next) {
  console.log(req.body);
  db.none('delete from gastos where id = ${id}', req.body)
    .then(function(){
      res.status(200)
        .json({
          status: "sucess",
          message: "Gasto eliminado"
        });
    })
      .catch(function(err){
        return next(err);
      });
}

function getLastGastos2(next){
  db.any('select  g.*, c.nombre as nombrecategoria from gastos g join categorias c on c.id = g.idcategoria order by fecha desc, id desc limit 4')
    .then(function (data) {
      next(data);
    })
    .catch(function (err) {
      return next(err);
    });
}


module.exports = {
    getAllGastos: getAllGastos,
    createGasto: createGasto,
    getLastGastos: getLastGastos,
    deleteGasto: deleteGasto,
    getLastGastos2: getLastGastos2
}
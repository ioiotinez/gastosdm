var express = require('express');
var router = express.Router();

var dbCategoria = require('../database/CategoriasBD');
var dbGasto = require('../database/GastosBD')
var dbPresupuesto = require('../database/PresupuestosBD')
var controllerPrespuesto = require('../controllers/PresupuestosController');

var GastoController = require('../controllers/GastosController');

//Auth vistas
var auth = function(req, res, next) {
  if (req.session && req.session.user === "ioiotinez" && req.session.admin)
    return next();
  else
    res.render("login", {title: 'Login'});
};

//Auth metodos
var authM = function(req, res, next) {
  if (req.session && req.session.user === "ioiotinez" && req.session.admin)
    return next();
  else
    res.send("No tiene permisos para la accion");
};

// Login endpoint
router.post('/login', function (req, res) {
  console.log(req.body);
  if (!req.body.usuario || !req.body.password) {
    res.status(200)
    .json({
      login: false,
      redirectTo: '/ingresar'
    });
  } else if(req.body.usuario === "ioiotinez" && req.body.password === "9041") {
    req.session.user = "ioiotinez";
    req.session.admin = true;
    res.status(200)
      .json({
        login: true,
        redirectTo: '/'
      });
  }
});
 
// Logout endpoint
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.render("login", {title: 'Login'});
});


// Vistas
router.get('/', auth, function (req, res) {
    res.render('index', { title: 'Gastos DM', pepito: '' });
  });

  router.get('/lista', auth, function (req, res) {
    res.render('lista', { title: "Lista de gastos" });
  })

  router.get('/presupuesto', auth, function (req, res) {
    res.render('presupuesto', { title: 'Presupuesto' });
  })

  router.get('/verpresupuesto', auth, function (req, res) {
    res.render('verpresupuesto', { title: 'Ver presupuesto' });
  })

  router.get('/ingresar', function(req,res){
    res.render('login', {title: 'Login'});
  })



  // Gastos
  router.get('/gastos', authM, dbGasto.getAllGastos);
  router.get('/ultimosgastos', authM, dbGasto.getLastGastos);
  router.post('/gastos/', authM, dbGasto.createGasto);
  router.delete('/gastos', authM, dbGasto.deleteGasto);

  // Categorias
  router.get('/apigastos/categorias',authM, dbCategoria.getAllCategorias);

  // Presupuesto
  router.post('/presupuestos/',authM, controllerPrespuesto.createPresupuesto);
  router.get('/getPresupuestos',authM, controllerPrespuesto.getAllPresupuestos);
  router.post('/getInfoPresupuesto/',authM, controllerPrespuesto.getGastosPorPresupuesto);
  router.post('/getGastosPorPresupuestoCategoria',authM, controllerPrespuesto.getGastosPorPresupuestoCategoriaDetalle);

  module.exports = router;
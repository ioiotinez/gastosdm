var db = require('../database/PresupuestosBD');
var promise = require('bluebird');

function createPresupuesto(req, res) {
    var vDescripcion = '';
    var vFechaDesde = '';
    var vFechaHasta = '';

    vDescripcion = req.body.descripcion;
    vFechaDesde = req.body.fechaDesde;
    vFechaHasta = req.body.fechaHasta;
    vPrespuestos = req.body.presupuestos;

    db.createPresupuesto({ descripcion: vDescripcion, fechaDesde: vFechaDesde, fechaHasta: vFechaHasta })
        .then(
        function (data) {
            for (var i = 0; i < vPrespuestos.length; i++) {
                console.log("presupuesto", vPrespuestos[i]);
                db.asociarCategoriaAPresupuesto(vPrespuestos[i], data.id);
            }
            res.status(200)
                .json({
                    data: data.id,
                    sucess: "sucess"
                });
        }
        );
}

function getGastosPorPresupuesto(req, res) {
    db.getGastosPorPresupuestoCategoria(req.body.id)
        .then(function (gastos) {
            var vRetorno = gastos;
            for (var i = 0; i < vRetorno.length; i++) {
                vRetorno[i].porcentaje = parseInt((vRetorno[i].totalgastado * 100) / vRetorno[i].presupuestado);
                if (vRetorno[i].porcentaje < 50) {
                    vRetorno[i].bar = "progress-bar-success";
                }
                else{
                    if(vRetorno[i].porcentaje < 80){
                         vRetorno[i].bar = "progress-bar-warning";
                    }
                        else{
                            vRetorno[i].bar = "progress-bar-danger";
                        }
                }
            }
            res.status(200)
                .json({
                    data: vRetorno,
                    success: "success"
                })
        })
}

function getGastosPorPresupuestoCategoriaDetalle(req,res){
    console.log(req.body);
    var vPresupuesto = req.body.idPresupuesto;
    var vCategoria = req.body.idCategoria;

    db.getGastosPorPresupuestoCategoriaDetalle(vPresupuesto,vCategoria)
        .then(function(data){
            res.status(200)
                .json({
                    data: data,
                    success: "success"
                });
        });
}

function getAllPresupuestos(req, res) {
    //var presupuestos = [];
    db.getAllPresupuestos()
        .then(function (data) {
            res.status(200)
                .json({
                    data: data,
                    success: "success"
                });
        });
}

module.exports = {
    createPresupuesto: createPresupuesto,
    getAllPresupuestos: getAllPresupuestos,
    getGastosPorPresupuesto: getGastosPorPresupuesto,
    getGastosPorPresupuestoCategoriaDetalle: getGastosPorPresupuestoCategoriaDetalle
}
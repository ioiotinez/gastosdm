var promise = require('bluebird');
var configbd = require('../configdb');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = configbd.connectionString;
var db = pgp(connectionString);


function getAllPresupuestos(req, res, next) {
    return db.any("select * from presupuestos");
}

function createPresupuesto(data) {
    var vQuery = "INSERT INTO presupuestos (descripcion, fechadesde, fechahasta) VALUES(" +
        "'" + data.descripcion + "', " +
        "'" + data.fechaDesde + "', " +
        "'" + data.fechaHasta + "') RETURNING id";

    return db.one(vQuery);
}

function asociarCategoriaAPresupuesto(data, id) {
    var vQuery = "INSERT INTO relpresupuestocategoria (idpresupuesto, idcategoria, montopresupuestado) VALUES(" +
        id + ", " +
        data.categoria.id + ", " +
        data.monto + ")";
    return db.none(vQuery);
}

function getGastosPorPresupuestoCategoria(idPresupuesto) {
    var vQuery = "select SUM(coalesce(g.monto, 0)) TotalGastado, " +
        "	r.montopresupuestado Presupuestado, " +
        "   cat.id IdCategoria, " +
        "	cat.nombre DescripcionCategoria " +
        "from presupuestos pre " +
        "	inner join relpresupuestocategoria r on r.idpresupuesto = pre.id " +
        "   inner join categorias cat on cat.id	 = r.idcategoria " +
        "  left join gastos g on g.idcategoria = r.idcategoria " +
        " 					and g.fecha >= pre.fechadesde " +
        "                    and g.fecha <= pre.fechahasta " +
        "where pre.id = " + idPresupuesto + " " +
        "group by cat.id, cat.nombre, r.montopresupuestado";
    return db.any(vQuery);
}

function getGastosPorPresupuestoCategoriaDetalle(idPresupuesto, idCategoria){
    var vQuery = "select gas.descripcion, gas.monto, gas.fecha from gastos gas "+
    "inner join relpresupuestocategoria rp on rp.idcategoria = gas.idcategoria "+
    "inner join presupuestos pre on pre.id = rp.idpresupuesto "+
    "                            and gas.fecha >= pre.fechaDesde "+
    "                            and gas.fecha <= pre.fechaHasta "+
    "where pre.id = "+ idPresupuesto + 
    "   and rp.idcategoria = " + idCategoria;
    return db.any(vQuery);
}
    



module.exports = {
    getAllPresupuestos: getAllPresupuestos,
    asociarCategoriaAPresupuesto: asociarCategoriaAPresupuesto,
    createPresupuesto: createPresupuesto,
    getGastosPorPresupuestoCategoria: getGastosPorPresupuestoCategoria,
    getGastosPorPresupuestoCategoriaDetalle: getGastosPorPresupuestoCategoriaDetalle
}
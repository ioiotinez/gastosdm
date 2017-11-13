var dbGasto = require('../database/GastosBD');


function getAllGastos(req, res) {
   dbGasto.getLastGastos2(function(data){
        console.log(data);
   });
}




module.exports = {
    getAllGastos: getAllGastos
}
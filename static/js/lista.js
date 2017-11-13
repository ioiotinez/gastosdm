
new Vue(
    {
        el: "#lista",

        data: {
            fechaDesde: '2017-07-01',
            fechaHasta: '2017-07-01',
            gastos: []
        },

        ready: function () {
            this.iniciarPagina();
        },

        methods: {
            iniciarPagina: function () {
                var date = new Date();
                this.fechaDesde = new Date(date.getFullYear(), date.getMonth(), 1);
                this.fechaHasta = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                this.filtrarGastos();
            },

            filtrarGastos: function () {
                
                this.$http.get('/gastos')
                    .success(function (gastosInicio) {
                        var vGastosMostrar = gastosInicio.data;
                        var vRetorno = [];
                        for (var i = 0; i < vGastosMostrar.length; i++) {
                            if (new Date(vGastosMostrar[i].fecha) >= new Date(this.fechaDesde) && new Date(vGastosMostrar[i].fecha) <= new Date(this.fechaHasta)) {
                                vRetorno.push(vGastosMostrar[i]);
                            }
                        }
                        this.$set('gastos', vRetorno);
                    })
                    .error(function (err) {
                        console.log(err);
                    });

            },

            deleteGasto: function (index) {
            if (confirm('Desea eliminar el gasto ' + this.gastos[index].descripcion) + '?') {
                this.$http.delete('/gastos',  this.gastos[index])
                    .success(function (res) {
                        this.gastos.splice(index, 1);
                    })
                    .error(function (err) {
                        console.log(err);
                    });
            }
        }
        }
    }
)
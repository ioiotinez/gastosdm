// var Vue = require('vue');

new Vue({
    el: '#gastos',

    data: {
        gasto: { descripcion: '', categoria: '', fecha: '', monto: '', nombrecategoria: '' },
        gastos: [],
        categorias: []
    },

    ready: function () {
        this.fetchGastos();
        this.fetchCategorias();
    },

    methods: {
        fetchCategorias: function () {
            var categorias = [];
            this.$http.get('apigastos/categorias')
                .success(function (categorias) {
                    this.$set('categorias',categorias.data);
                })
                .error(function (err) {
                    console.log(err);
                })
        },

        fetchGastos: function () {
            this.gastos = [];
            this.$http.get('/ultimosgastos')
                .success(function (gastosInicio) {
                    this.$set('gastos', gastosInicio.data);
                })
                .error(function (err) {
                    console.log(err);
                });
        },

        addGasto: function () {
            if (this.gasto.descripcion.trim()) {
                this.$http.post('/gastos', this.gasto)
                    .success(function (res) {
                        this.gasto.id = res.inserterdId;
                        for (var i = 0; i < this.categorias.length; i++) {
                            if (this.categorias[i].id == this.gasto.categoria.id) {
                                this.gasto.nombrecategoria = this.categorias[i].nombre;
                            }
                        }
                        this.gastos.unshift(this.gasto);
                        this.gasto = { descripcion: '', fecha: '', monto: '' };
                    })
                    .error(function (err) {
                        console.log(err);
                    });
            }
        },

        deleteGasto: function (index) {
            if (confirm('Desea eliminar el gasto ' + this.gastos[index].descripcion) + '?') {
                this.$http.delete('/gastos', this.gastos[index])
                    .success(function (res) {
                        this.gastos.splice(index, 1);
                    })
                    .error(function (err) {
                        console.log(err);
                    });
            }
        },
    }
});
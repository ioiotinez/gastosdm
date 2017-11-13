new Vue({
    el: "#presupuestos",
    data: {
        descripcion: '',
        fechadesde: '',
        fechahasta: '',
        categorias: [],
        categoriasPresupuestos: [],
        categoria: { id: 0, nombre: '' },
        monto: ''
    },
    ready: function () {
        this.fetchCategorias();
    },
    methods: {
        fetchCategorias: function () {
            var categorias = [];
            this.$http.get('apigastos/categorias')
                .success(function (categorias) {
                    this.$set('categorias', categorias.data);
                })
                .error(function (err) {
                    console.log(err);
                })
        },
        addPresupuestoCategoria: function () {
            this.categoriasPresupuestos.push({
                categoria: { id: this.categoria.id, nombre: this.getNombreCategoria(this.categoria.id) },
                monto: this.monto
            });
            this.categorias.splice(this.getIndexCategorias(this.categoria.id), 1);
            this.categoria = {id: 0, nombre: ''};
            this.monto = '';
        },
        getIndexCategorias: function (id) {
            for (var i = 0; i < this.categorias.length; i++) {
                if(this.categorias[i].id == id){
                    return i;
                }
            }
        },
        getNombreCategoria: function (id) {
            var retorno = '';
            for (var i = 0; i < this.categorias.length; i++) {
                if (this.categorias[i].id == id) {
                    retorno = this.categorias[i].nombre;
                }
            }
            return retorno;
        },
        quitarPresupuesto: function (index) {
            this.categorias.push(this.categoriasPresupuestos[index].categoria);
            this.categoriasPresupuestos.splice(index, 1);
        },
        addPresupuesto: function () {
            this.$http.post('/presupuestos', { descripcion: this.descripcion, fechaDesde: this.fechadesde, fechaHasta: this.fechahasta, presupuestos: this.categoriasPresupuestos })
                .success(function (res) {
                    if (res.sucess == 'sucess') {
                        var insertedId = res.data;
                        console.log("ID Presupuesto", insertedId);
                        this.descripcion = '';
                        this.fechadesde = '';
                        this.fechahasta = '';
                        this.categoriasPresupuestos = [];
                        fetchCategorias();
                        alert("Presupuesto ingresado correctamente");
                    }
                    else {
                        alert("Error al ingresar el presupuesto");
                    }

                })
                .error(function (err) {
                    console.log(err);
                });
        }
    }
});
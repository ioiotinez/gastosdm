var vueJs = new Vue({
    el: '#verpresupuestos',

    data: {
        presupuestos: [],
        presupuestoSeleccion: {
            id: '',
            descripcion: '',
            fechaDesde: '',
            fechaHasta: '', 
            categoriasPresupuesto: [],
            totalPresupuestado: 0,
            totalGastado: 0
        },
        gastos: [],
        titulogastos: ''
    },
    ready: function(){
        this.obtenerPresupuestos();
    },
    methods: {
        obtenerPresupuestos: function(){
            this.$http.get('/getPresupuestos')
                .success(function(data){
                    this.presupuestos = data.data;
                    console.log(this.presupuestos[0].categoriasPresupuesto);
                })
        },
        verPresupuesto: function(){
            this.$http.post('/getInfoPresupuesto', this.presupuestoSeleccion)
                .success(function(data){
                    this.presupuestoSeleccion.categoriasPresupuesto = data.data;
                    this.presupuestoSeleccion.totalGastado = 0;
                    this.presupuestoSeleccion.totalPresupuestado = 0;
                    for(var i = 0; i< data.data.length; i++){
                        this.presupuestoSeleccion.totalGastado += parseInt(data.data[i].totalgastado);
                        this.presupuestoSeleccion.totalPresupuestado += parseInt(data.data[i].presupuestado);
                    }
                })
        },
        verGastos: function(index){
            this.$http.post('/getGastosPorPresupuestoCategoria', {
                idPresupuesto: this.presupuestoSeleccion.id,
                idCategoria: this.presupuestoSeleccion.categoriasPresupuesto[index].idcategoria
            })
            .success(function(data){
                this.gastos = data.data;
                this.titulogastos = this.presupuestoSeleccion.categoriasPresupuesto[index].descripcioncategoria;
            })
        }
    }
})
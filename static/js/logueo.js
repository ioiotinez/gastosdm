new Vue({
    el: '#logueo',
    data: {
        usuario: '',
        password: ''
    },
    ready: function () {

    },
    methods: {
        login: function () {
            this.$http.post('/login', { usuario: this.usuario, password: this.password })
                .success(function (data) {
                    console.log(data);
                    if (data.login == true) {
                        window.location = data.redirectTo;
                    }
                });
        }
    }
});
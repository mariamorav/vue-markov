import Vue from 'vue'
import App from './App.vue'
import '../src/assets/styles/tailwind.css'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'


Vue.use(VueSweetalert2)

new Vue({
    el: "#app",
    render: (h) => h(App)
})

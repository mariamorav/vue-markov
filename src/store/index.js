import Vue from "vue";
import Vuex from "vuex";

//folders store
import matriz from "./matriz";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        matriz
    }
});

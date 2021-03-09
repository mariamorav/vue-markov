import mutations from "./mutations";
import getters from "./getters";
import { actions } from "./actions";

const state = () => {
    return {
        matriz: []
    };
};

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
};

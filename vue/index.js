Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        activeTool: "none",
    },
    mutations: {
        setActiveTool(state, activeToolName) {
            state.activeTool = activeToolName
        }
    }
})

var provEditor = new Vue({
    el: '#prov-editor',
    data: {
    }
})
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        activeTool: "none",
    },
    mutations: {
        setActiveTool(state, activeToolName) {
            switch (activeToolName) {
                case "entityTool":
                    state.activeTool = "entity";
                    break;
                case "activityTool":
                    state.activeTool = "activity";
                    break;
                case "agentTool":
                    state.activeTool = "agent";
                    break;
                default:
                    state.activeTool = "none";
            }
        }
    }
})

var provEditor = new Vue({
    el: '#prov-editor',
    data: {
    }
})
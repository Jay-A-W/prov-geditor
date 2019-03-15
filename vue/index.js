Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        activeTool: "none",
        currentSource: "",
        currentTarget: "",
        currentLink: {},
        currentElement: "undefined",
        prefixSet: [],
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
                    state.activeTool = activeToolName;
            }
        },

        setCurrentSource(state, source) {
            state.currentSource = source;
        },

        setCurrentTarget(state, target) {
            state.currentTarget = target;
        },

        setCurrentLink(state, link) {
            state.currentLink = link;
        },

        setCurrentLinkLabel(state, label){
            state.currentLink.label("attr/text/font-weight", 'bold');
            state.currentLink.label("attr/label", { position: .5, attrs: { text: { text: label || '', 'font-weight': 'bold' } } });
            state.currentLink.attr("relType", label);
        },

        setCurrentElement(state, element) {
            state.currentElement = element;
        },

        setCurrentElementLabel(state, label) {
            state.currentElement.model.attr('label/text', label);
        },

        setCurrentGraph(state, graph) {
            state.currentGraph = graph;
        },

        setCurrentDoc(state, doc) {
            state.currentDoc = doc;
        },

        addPrefixToSet(state, prefix) {
            if (!state.prefixSet.includes(prefix)) {
                state.prefixSet.push(prefix)
                return true;
            } else {
                console.log("Prefix already in set")
                return false;
            }
        }
    },
})

var provEditor = new Vue({
    el: '#prov-editor',
    data: {
    }
})
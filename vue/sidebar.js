Vue.component('sidebar', {
    template: `
        <div class ="sidebar">
            <button id="entityTool"><i class ="fa fa-fw fa-square"></i></button>
            <button id="activityTool"><i class ="fa fa-fw fa-square"></i></button>
            <button id="agentTool"><i class ="fa fa-fw fa-caret-up"></i></button>
            <button id="prefixTool" @click="showNSModal()">ex</button>
            <button id="ajaxTool" @click="showExportModal()">ajax</button>
            <button id="attrTool">attr</button>
            <button id="saveTool" @click="saveDoc">save</button>
            <button id="loadTool" @click="loadDoc">load</button>
            <button id="clearTool" @click="clearGraph()">clear</button>

        </div>
    `
    ,
    props:{
       
    },
    data: function(){
        return {
            activeTool: String,
        }
    },
    computed: {
       
    },
    methods: {
        addClickListener(className) {
            document.getElementById(className).addEventListener("click", function () {
                //.activeTool = className;
                console.log(className);
                store.commit("setActiveTool", className);
                //console.log(store.state.activeTool);
            });
        },
        showNSModal() {
            $("#namespace-modal").show();
        },
        showExportModal() {
            $("#export-modal").show();
        },
        clearGraph() {
            graph.clear();
            localStorage.clear();
        },
        saveDoc() {
            $("#save-modal").show();
            let saveFile = {};
            saveFile.graph = graph;
            saveFile.doc = {};
            saveFile.doc.namespaces = doc.scope.namespaces;
            saveFile.doc.statements = localStorage.getItem("statements");
            console.log(saveFile);
            $(".save-data-area").val(JSON.stringify(saveFile));
        },
        loadDoc() {
            $("#load-modal").show();
            $(".load-data-area").val("");
        }
    },
    mounted() {
        this.addClickListener("entityTool");
        this.addClickListener("activityTool");
        this.addClickListener("agentTool");
        this.addClickListener("attrTool");
    }
})
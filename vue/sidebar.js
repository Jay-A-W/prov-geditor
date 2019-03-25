Vue.component('sidebar', {
    template: `
        <div class ="sidebar">
            <button id="entityTool"><i class="entity-icon fas fa-square" data-toggle="tooltip" title="Entity Element (Select and click canvas to apply)"></i></button>
            <button id="activityTool"><i class="activity-icon fas fa-square-full" data-toggle="tooltip" title="Activity Element (Select and click canvas to apply)"></i></button>
            <button id="agentTool"><i class="agent-icon" data-toggle="tooltip" title="Agent Element (Select and click canvas to apply)">&#9650;</i></button>
            </br></br>
            <button id="attrTool" data-toggle="tooltip" title="Add Attribute to element or link (Select and click object to apply)">+attr</button>
            <button id="prefixTool" data-toggle="tooltip" title="Add Namespace Prefix" @click="showNSModal()">+ns</button>
            </br></br>
            <button id="saveTool" data-toggle="tooltip" title="Save" @click="saveDoc"><i class ="fa fa-save"></i></button>
            <button id="loadTool"  data-toggle="tooltip" title="Load" @click="loadDoc"><i class ="fa fa-upload"></i></button>
            <button id="ajaxTool"  data-toggle="tooltip" title="Convert to different data type" @click="showExportModal()"><i class ="fas fa-file-export"></i></button>
            </br></br>
            <button id="clearTool"  data-toggle="tooltip" title="Clear Canvas" @click="clearGraph()"><i class ="fa fa-trash"></i></button>
            </br></br>
            <button id="helpTool"  data-toggle="tooltip" title="How to use the PROV Editor" @click="showHelpModal()"><i class ="fas fa-question"></i></button>
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
                store.commit("setActiveTool", className);
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
            $(".save-data-area").val(JSON.stringify(saveFile));
        },
        loadDoc() {
            $("#load-modal").show();
            $(".load-data-area").val("");
        },
        showHelpModal() {
            $("#help-modal").show();
        }
    },
    mounted() {
        this.addClickListener("entityTool");
        this.addClickListener("activityTool");
        this.addClickListener("agentTool");
        this.addClickListener("attrTool");
    }
})
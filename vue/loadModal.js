Vue.component('load-modal', {
    template: `
        <div id="load-modal" class="modal" hidden>
            <div class="modal-content">
                <div class ="load-input-content">
                    <span class ="close close-input-content" @click='closeModal()'>&times; </span>
                    Paste your data here:</br>
                    <textarea class="load-data-area" onfocus="this.value=''" rows="4" cols="50">
                    </textarea> 
                    </br>
                    <button class ="submit load-submit" @click='loadData()'>Submit</button>
                </div>
                <div class ="load-warning-content" hidden>
                    <span class ="close close-warning-content" @click='closeWarning()'>&times; </span>
                    <div class="invalid">Data format is invalid</div>
                </div>
            </div>
        </div>
    `
    ,
    props: {

    },
    data: function () {
        return {
            activeTool: String,
        }
    },
    computed: {

    },
    methods: {
        loadData() {
            try{
                let data = JSON.parse($(".load-data-area").val());
                let namespaces = data.doc.namespaces;
                let graphData = data.graph;
                let statements = data.doc.statements;
                doc.scope.namespaces = data.doc.namespaces;
                loadStatements(JSON.parse(statements));
                graph.fromJSON(graphData);
                localStoreSaveStatements();
                localStorage.setItem('graph', JSON.stringify(graph));
                localStorage.setItem('doc', JSON.stringify(doc));
                $("#load-modal").hide();
            }
            catch (err) {
                $(".load-input-content").hide();
                $(".load-warning-content").show();
            }
        },
        closeModal() {
            $("#load-modal").hide();
        },
        closeWarning() {
            $(".load-warning-content").hide();
            $(".load-input-content").show();
            $("#load-modal").hide();
        }
    },
    mounted() {
    }
})
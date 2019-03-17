Vue.component('exported-data-modal', {
    template: `
        <div id="exported-data-modal" class="modal" hidden>
            <div class="modal-content">
                <div class ="exported-data-content">
                    <span class ="close close-input-content" @click='closeModal()'>&times; </span>
                    <textarea class="export-data-area" rows="10" cols="100" readonly>
                    </textarea> 
                    </br>
                    <button class ="export-copy" @click='copyData()'>Copy to Clipboard</button>
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
        copyData() {
            var copyDOM = $(".export-data-area");
            copyDOM.select();
            document.execCommand("copy");
        },
        closeModal() {
            $("#exported-data-modal").hide();
        },
    },
    mounted() {
    }
})
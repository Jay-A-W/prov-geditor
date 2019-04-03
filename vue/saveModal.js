Vue.component('save-modal', {
    template: `
        <div id="save-modal" class="modal" hidden>
            <div class="modal-content">
                <div class ="save-input-content">
                    <span class ="close close-input-content" @click='closeModal()'>&times; </span>
                    Copy the data below:</br>
                    <textarea class="save-data-area" rows="4" cols="50" readonly>
                    </textarea> 
                    </br>
                    <button class ="save-copy" @click='copyData()'>Copy to Clipboard</button>
                </div>
            </div>
        </div>
    `
    ,
    data: function () {
        return {
            activeTool: String,
        }
    },
    methods: {
        copyData() {
            var copyDOM = $(".save-data-area");
            copyDOM.select();
            document.execCommand("copy");
        },
        closeModal() {
            $("#save-modal").hide();
        },
    }
})
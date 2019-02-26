Vue.component('export-modal', {
    template: `
       <div id="export-modal" class="modal" hidden>
           <div class ="modal-content">
            <span class ="close close-input-content" @click='close()'>&times; </span>
            <select class="export-options" name="scripts">
                <option value="text/turtle">turtle</option>
                <option value="text/provenance-notation">provenance</option>
                <option value="application/provenance+xml">prov xml</option>
                <option value="application/trig">trig</option>
                <option value="application/rdf+xml">rdf xml</option>
                <option value="application/json">json</option>
            </select>
            <button class ="submit-export-modal" @click='submit()'>Submit</button>
           </div>
       </div>
    `
    ,
    props: {

    },
    data: function () {
        return {

        }
    },
    computed: {

    },
    methods: {
        submit() {
            this.ajaxRequest($(".export-options").val());
            $("#export-modal").hide();
        },
        close() {
            $("#export-modal").hide();
        },
        ajaxRequest(acceptType) {
            let jsonProv = getProvAsJSON(doc);
            $.ajax({
                url: 'https://openprovenance.org/services/provapi/documents2',
                type: "POST",
                headers: {
                    Accept: acceptType,
                    "Content-Type": 'application/json',
                },
                data: JSON.stringify(jsonProv),
                success: function (result) {
                    console.log(result);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            })
        }
    },
})
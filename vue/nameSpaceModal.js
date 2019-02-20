Vue.component('namespace-modal', {
    template: `
       <div id="namespace-modal" hidden>
           <div class="modal-content">
               <div class ="ns-input-content">
                   <span class ="close close-ns-input-content" @click='closeInputModal()'>&times; </span>
                   <input class="ns-input-prefix modal-input" type="text" name="Prefix" value="Enter Prefix..." onfocus="this.value=''"></br>
                   <input class="ns-input-URI modal-input" type="text" name="URI" value="Enter URI..." onfocus="this.value=''"></br>
                   <button class ="submit-nsModal" @click='submitNS()'>Submit</button>
               </div>
               <div class ="ns-warning-content" hidden>
                    <span class ="close ns-close-warning-content" @click='closeWarning()'>&times; </span>
                    <div class="ns-invalid-URI"> This URI is invalid </div>
               </div>
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
        submitNS() {
            let exp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            let regex = new RegExp(exp);
            let prefix = $(".ns-input-prefix").val();
            let URI = $(".ns-input-URI").val()
            if (URI.match(regex)) {
                doc.addNamespace(prefix, URI);
                store.commit("addPrefixToSet", prefix);
                this.closeInputModal();
            } else {
                $(".input-content").hide();
                $(".warning-content").show();
            }
        },
        closeInputModal() {
            $("#namespace-modal").hide();
            $(".ns-input-prefix").val("Enter Prefix...");
            $(".ns-input-URI").val("Enter URI...");
        },
        closeWarning() {
            $("#namespace-modal").hide();
            $(".ns-warning-content").hide();
            $(".ns-input-content").show();
            $(".ns-input-prefix").val("Enter Prefix...");
            $(".ns-input-URI").val("Enter URI...");
        },
    },
})
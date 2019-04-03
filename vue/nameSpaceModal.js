Vue.component('namespace-modal', {
    template: `
       <div id="namespace-modal" class="modal" hidden>
           <div class="modal-content">
               <div class ="ns-input-content">
                   <span class ="close close-ns-input-content" @click='closeInputModal()'>&times; </span>
                   <input class="ns-input-prefix modal-input" type="text" name="Prefix" value="Enter Prefix..." onfocus="this.value=''"></br>
                   <input class="ns-input-URI modal-input" type="text" name="URI" value="Enter URI..." onfocus="this.value=''"></br>
                   <button class ="submit nsModal" @click='submitNS()'>Submit</button>
               </div>
               <div class ="ns-warning-content" hidden>
                    <span class ="close ns-close-warning-content" @click='closeWarning()'>&times; </span>
                    <div class="ns-invalid-URI"> This URI is invalid or prefix already exists</div>
               </div>
           </div>
       </div>
    `
    ,
    methods: {
        submitNS() {
            let exp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi; //Regex for URL validation
            let regex = new RegExp(exp);
            let prefix = $(".ns-input-prefix").val();
            let URI = $(".ns-input-URI").val();
            if (URI.match(regex) && !this.alreadyExists(prefix)) {
                addNamespaceNotParent(doc, prefix, URI);
                store.commit("addPrefixToSet", prefix);
                localStorage.setItem('doc', JSON.stringify(doc));
                localStorage.setItem('prefixSet', store.state.prefixSet);
                this.closeInputModal();
            } else {
                $(".ns-input-content").hide();
                $(".ns-warning-content").show();
            }
        },
        alreadyExists(prefix) {
            if (doc.scope.namespaces.hasOwnProperty(prefix)) {
                return true;
            } else {
                return false;
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
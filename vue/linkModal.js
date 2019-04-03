Vue.component('link-modal', {
    template: `
       <div id="linkModal" class="modal" hidden>
           <div class="modal-content">
               <div class ="input-content">
                   <span class ="close close-input-content" @click='closeInputModal()'>&times; </span>
                    <div> Choose Generation Date (Optional)</div>
                    </br>
                    <div class="link-date-time-picker">Date: <input class="link-generated-time" type="datetime-local" name="Date Time Picker"></div>
                    <button class ="submit link-modal" @click='editLink()'>Submit</button>
               </div>
               <div class ="warning-content" hidden>
                    <span class ="close close-warning-content" @click='closeWarning()'>&times; </span>
                    <div class="invalid-prefix"> The prefix given has not been registered yet or you have not given a name, you can register a prefix by selecting the 'ex' icon on the sidebar</div>
               </div>
           </div>
       </div>
    `
    ,
    methods: {
        editLink(){ //Edit link specifically for Generation relation for generatedAt time
            let currentLink = store.state.currentLink;
            let source = getElementById(currentLink.model.attributes.source.id);
            let target = getElementById(currentLink.model.attributes.target.id);
            let sourceType = source.attributes.type.replace("custom.", "");
            let targetType = target.attributes.type.replace("custom.", "");
            let provLink = doc.scope.statements.filter(linkType => linkType.constructor.name == "Generation").filter(function (link) { //Filter PROV Document for specific Generation relation
                if ((link.properties.hasOwnProperty(sourceType.toLowerCase())) && (link.properties.hasOwnProperty(targetType.toLowerCase()))) {
                    if ((link[sourceType.toLowerCase()].localPart == source.attributes.attrs.label.text) && (link[targetType.toLowerCase()].localPart == target.attributes.attrs.label.text)) {
                        return true;
                    }
                }
                return false;
            });
            provLink[0].properties.time = getValidDate($('.link-generated-time').val());
            localStoreSaveStatements();
            $("#linkModal").hide();
        },
        closeInputModal() {
            $("#linkModal").hide();
          
        },
        closeWarning() {
            $("#linkModal").hide();
            $(".warning-content").hide();
            $(".input-content").show();
        },
    }
})
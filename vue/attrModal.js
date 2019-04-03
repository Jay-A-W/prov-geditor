Vue.component('attr-modal', {
    template: `
       <div id="attrModal" class="modal" hidden>
           <div class="modal-content">
               <div class ="input-content">
                   <span class ="close close-input-content" @click='closeModal()'>&times; </span>
                   <div class="attr-name-prefix">
                       <div> Enter Attribute Name Prefix </div>
                       <select v-model="attrNamePrefix" class="input-attr-name-prefix modal-input" name="AttrPrefix">
                            <option value="" selected disabled>Choose Prefix</option>
                            <option v-for="prefix in prefixes" :key='prefix' v-bind:value='prefix'>{{prefix}}</option>
                       </select>
                       <input class="input-attrName modal-input" type="text" name="Attr Name" value="Enter Attribute Name..." onfocus="this.value=''"></input></br>
                   </div>
                   </br>
                   <div class="attr-val-prefix">
                       <div> Enter Attribute Value Prefix for {{this.currentName}}</div>
                       <select v-if="attrNamePrefix==='prov'" class="input-attr-value-prefix modal-input" name="AttrPrefix">
                                <option value="" selected disabled>Choose Prefix</option>
                                <option v-for="prefix in prefixes" :key='prefix' v-bind:value='prefix'>{{prefix}}</option>
                           </select>
                       <input class="input-attrValue modal-input" type="text" name="Attr Value" value="Enter Attribute Value..." onfocus="this.value=''"></input></br>
                   </div>
                   <button class ="submit attr-modal" @click='submitAttr()'>Submit</button>
               </div>
               <div class ="warning-content" hidden>
                    <span class ="close close-warning-content" @click='closeWarning()'>&times; </span>
                    <div class="invalid">You have not entered an attribute name/value</div>
               </div>
           </div>
       </div>
    `
    ,
    data: function () {
        return {
            prefixes: store.state.prefixSet,
            attrNamePrefix: "none",
        }
    },
    methods: {
        submitAttr() {
            if (($(".input-attr-name-prefix").val() != null) && ($(".input-attrName").val() != "Enter Attribute Name...") && ($(".input-attrValue").val() != "Enter Attribute Value...")) {
                if (this.attrNamePrefix == "prov") {
                    if ($(".input-attr-value-prefix").val() != null) {
                        this.addAttr();
                        this.closeModal();
                    } else {
                        $(".input-content").hide();
                        $(".warning-content").show();
                    }
                } else {
                    this.addAttr();
                    this.closeModal();
                }
            } else {
                $(".input-content").hide();
                $(".warning-content").show();
            }
        },
        closeModal() {
            $("#attrModal").hide();
            $(".input-attrName").val("Enter Attribute Name...");
            $(".input-attrValue").val("Enter Attribute Value...");
        },
        closeWarning() {
            $(".warning-content").hide();
            $(".input-content").show();
            $("#attrModal").hide();
        },
        addAttr() {
            if (store.state.currentElement != "undefined") {
                this.addAttrElement();
            } else if (store.state.currentLink != "undefined") {
                this.addAttrLink();
            } else {
            $(".input-content").hide();
                $(".warning-content").show();
            }
        },
        addAttrElement() { //Add attribute to element
            let attrNamePrefix = $(".input-attr-name-prefix").val();
            let attrNameURI = doc.scope.namespaces[attrNamePrefix].namespaceURI;
            let attrName = $(".input-attrName").val();
            let attrValue = $(".input-attrValue").val();
            let element = store.state.currentElement;
            let type = element.model.attributes.type.replace("custom.", "");
            let currentName = element.model.attributes.attrs.label.text;
            let provElement = doc.scope.statements.filter(elementType => elementType.constructor.name == type).filter(element => element.identifier.localPart == currentName);
            let qnName = new QualifiedName(attrNamePrefix, attrName, attrNameURI);
            let qnValue;
            if (this.attrNamePrefix == "prov") { //If attr name prefix is prov then the value must be a qualified name object
                let attrValuePrefix = $(".input-attr-value-prefix").val();
                let attrValURI = doc.scope.namespaces[attrValuePrefix].namespaceURI;
                qnValue = new QualifiedName(attrValuePrefix, attrValue, attrValURI);
                provElement[0].attributes.push([qnName, qnValue]);
            } else {
                provElement[0].attributes.push([qnName, attrValue]);
            }
            localStoreSaveStatements();
        },
        addAttrLink() { //Add attribute to link
            let attrNamePrefix = $(".input-attr-name-prefix").val();
            let attrNameURI = doc.scope.namespaces[attrNamePrefix].namespaceURI;
            let attrName = $(".input-attrName").val();
            let attrValue = $(".input-attrValue").val();
            let link = store.state.currentLink;
            let type = link.model.attributes.attrs.relType;
            if (type.constructor.name == "Object") {
                type = link.model.attributes.labels[0].attrs.text.text;
            }
            let provLink = filterForLink(link.model, type);
            let qnName = new QualifiedName(attrNamePrefix, attrName, attrNameURI);
            let qnValue;
            if (this.attrNamePrefix == "prov") { //If attr name prefix is prov then the value must be a qualified name object
                let attrValuePrefix = $(".input-attr-value-prefix").val();
                let attrValURI = doc.scope.namespaces[attrValuePrefix].namespaceURI;
                qnValue = new QualifiedName(attrValuePrefix, attrValue, attrValURI);
                provLink[0].attributes.push([qnName, qnValue]);
            } else {
                provLink[0].attributes.push([qnName, attrValue]);
            }
            localStoreSaveStatements();
        }
    },
})
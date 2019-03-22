Vue.component('element-modal', {
    template: `
       <div id="elementModal" class="modal" hidden>
           <div class="modal-content">
               <div class ="input-content">
                   <span class ="close close-input-content" @click='closeInputModal()'>&times; </span>
                   <select class="input-prefix modal-input" name="Export">
                        <option value="" selected disabled>Choose Prefix</option>
                        <option v-for="prefix in prefixes" :key='prefix' v-bind:value='prefix'>{{prefix}}</option>
                   </select>
                   </br>
                   <input class="input-elementName modal-input" type="text" name="Element Name" value="Enter Element Name..." onfocus="this.value=''"></input></br>
                   <div v-if="this.checkIfActivity()" class="date-time-div">
                        <div> Choose Activity Date (Optional)</div>
                        </br>
                        <button class="show-date-time-picker" @click="showDateTimePicker()">Show</button>
                        <div class="date-time-picker">Start Date: <input class="start-time" type="datetime-local" name="Date Time Picker"></div>
                            <div class="date-time-picker">End Date: <input class="end-time" type="datetime-local" name="Date Time Picker"></div>
                        </div>
                   <button class ="submit element-modal" @click='submitElement()'>Submit</button>
               </div>
               <div class ="warning-content" hidden>
                    <span class ="close close-warning-content" @click='closeWarning()'>&times; </span>
                    <div class="invalid-prefix"> The prefix given has not been registered yet or you have not given a name, you can register a prefix by selecting the 'ex' icon on the sidebar</div>
               </div>
           </div>
       </div>
    `
    ,
    props:{
       
    },
    data: function(){
        return {
            prefixes: store.state.prefixSet,
            currentElement: store.state.currentElement
        }
    },
    computed: {
        
    },
    methods: {
        checkIfActivity() {
            if (store.state.currentElement != "undefined") {
                if (store.state.currentElement.model.attributes.type == "custom.Activity") {
                    return true;
                } else {
                    return false;
                }
            }
        },
        submitElement(){
            if (($(".input-prefix").val() != null) && ($(".input-elementName").val() != "Enter Element Name...")) {
                this.editElement();
                this.closeInputModal();
            } else {
                $(".input-content").hide();
                $(".warning-content").show();
            }
        },
        closeInputModal() {
            $("#elementModal").hide();
            $(".input-elementName").val("Enter Element Name...");
            $(".show-date-time-picker").show();
            $(".start-time").val("");
            $(".end-time").val("");
            $(".date-time-picker").css("display", "none");
        },
        closeWarning() {
            $("#elementModal").hide();
            $(".warning-content").hide();
            $(".input-content").show();
            $(".input-prefix").val("Enter Prefix...");
            $(".input-elementName").val("Enter Element Name...");
        },
        showDateTimePicker() {
            $(".show-date-time-picker").hide();
            $(".date-time-picker").css("display", "inline-block");
        },
        editElement() {
            let element = store.state.currentElement;
            let type = element.model.attributes.type.replace("custom.", "");
            let currentName = element.model.attributes.attrs.label.text;
            let newName = $(".input-elementName").val();
            let prefix = $(".input-prefix").val();
            let startTime = $(".start-time").val();
            let endTime = $(".end-time").val()
            element.model.attr('body/magnet', true);
            if ((startTime != "") && (endTime != "")) {
                editPROVElement(type, currentName, newName, prefix, startTime, endTime);
            } else {
                editPROVElement(type, currentName, newName, prefix);
            }
            store.commit("setCurrentElementLabel", newName);
            localStorage.setItem('graph', JSON.stringify(graph));
            localStorage.setItem('doc', JSON.stringify(doc));
            localStoreSaveStatements();
        }
    },
    created() {
    }
})
//<!--<transition v-on:enter="this.addDateTimePicker">-->
//                  <div v-if="this.checkIfActivity()" class="date-time-div">
//                       <div> Choose Activity Date (Optional)</div>
//                       </br>
//                       <button class="show-date-time-picker" @click="showDateTimePicker()">Show</button>
//                       <div class="date-time-picker">Start Date: <input class="start-time" type="datetime-local" name="Date Time Picker"></div>
//                       <div class="date-time-picker">End Date: <input class="end-time" type="datetime-local" name="Date Time Picker"></div>
//                  </div>
//              <!--</transition>-->
Vue.component('element-modal', {
    template: `
       <div id="elementModal" hidden>
           <div class="modal-content">
               <div class ="input-content">
                   <span class ="close close-input-content" @click='closeInputModal()'>&times; </span>
                   <input class="input-prefix element-modal-input" type="text" name="Prefix" value="Enter Prefix..." onfocus="this.value=''"></br>
                   <input class="input-elementName element-modal-input" type="text" name="Element Name" value="Enter Element Name..." onfocus="this.value=''"></br>
                   <button class ="submit-elementModal" @click='submitElement()'>Submit</button>
               </div>
               <div class ="warning-content" hidden>
                    <span class ="close close-warning-content" @click='closeWarning()'>&times; </span>
                    <div class="invalid-prefix"> The prefix given has not been registered yet, you can do this by selecting the 'ex' icon on the sidebar</div>
               </div>
           </div>
       </div>
    `
    ,
    props:{
       
    },
    data: function(){
        return {
           
        }
    },
    computed: {
       
    },
    methods: {
        submitElement(){
            if (store.state.prefixSet.includes($(".input-prefix").val())) {
                $("#elementModal").hide();
            } else {
                $(".input-content").hide();
                $(".warning-content").show();
            }
        },
        closeInputModal(){
            $("#elementModal").hide();
            $(".input-prefix").val("Enter Prefix...");
            $(".input-elementName").val("Enter Element Name...");
        },
        closeWarning() {
            $("#elementModal").hide();
            $(".warning-content").hide();
            $(".input-content").show();
            $(".input-prefix").val("Enter Prefix...");
            $(".input-elementName").val("Enter Element Name...");
        }
    },
})
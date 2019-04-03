Vue.component('help-modal', {
    template: `
        <div id="help-modal" class="modal" hidden>
            <div class="modal-content">
                <span class="close close-input-content" @click='closeModal()'>&times; </span>
                <div class="help-content">
                    <ol class="help-list">
                        <li>Create a new element by selecting one of the shapes and clicking onto the canvas </li>
                        <li>Double click an element to edit it </li>
                        <li>Drag from one element to another to create a relation </li>
                        <li>Select the attribute function and click an element to add an attribute </li>
                        <li>A wasGeneratedBy relation and Activity element can be double clicked to add a time attribute to </li>
                    </ol>
                </div>
                <a class="help-link" href="https://www.w3.org/TR/prov-overview/" target="_blank">Click this link to learn more about the PROV</a>
            </div>
        </div>
    `
    ,
    methods: {
        closeModal() {
            $("#help-modal").hide();
        }
    }
})
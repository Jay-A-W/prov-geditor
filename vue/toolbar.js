Vue.component('toolbar', {
    template: `
        <div class="toolbar">

        </div>
    `
    ,
    computed: {
        createToolbar() {
            var tbContainer = document.createElement('div');
            var toolbar = new mxToolbar(tbContainer);
            toolbar.enabled = false;
        }
    },
    methods: {

    },
})
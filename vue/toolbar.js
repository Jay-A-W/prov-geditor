//Vue.component('toolbar', {
//    template: `
//        <div class="toolbar">

//        </div>
//    `
//    ,
//    props:{
//        graph: ;
//    },
//    computed: {
//        createToolbar() {
//            var tbContainer = document.createElement('div');
//            tbContainer.style.position = 'absolute';
//            tbContainer.style.overflow = 'hidden';
//            tbContainer.style.padding = '2px';
//            tbContainer.style.left = '0px';
//            tbContainer.style.top = '26px';
//            tbContainer.style.width = '24px';
//            tbContainer.style.bottom = '0px';

//            $(".editor").add(tbContainer);

//            // Creates new toolbar without event processing
//            this.toolbar = new mxToolbar(tbContainer);
//            toolbar.enabled = false;

//        },
//    },
//    methods: {

//    },
//})
Vue.component('editor', {
    template: `
        <div class="editor-container">
            <template v-if="isBrowserSupported">
                <div class="editor">
                
                </div>
            </template>
        </div>
    `
    ,

    data: function () {
        return {
            toolbar, 
        }
    },

    computed: {
        isBrowserSupported() {
            if (!mxClient.isBrowserSupported()) {
                mxUtils.error('Browser is not supported!', 200, false);
                return false;
            } else {
                return true;
            }
        },
    },
    methods: {
        fixIE(container) {
            if (mxClient.IS_QUIRKS) {
                document.body.style.overflow = 'hidden';
                new mxDivResizer(container);
            }
        },

        addVertex(icon, w, h, style, graph) {
            var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
            vertex.setVertex(true);

            this.addToolbarItem(graph, this.toolbar, vertex, icon);
        },

        createCanvas() {
            let canvas = document.createElement('div');
            $("editor").add(canvas);
            canvas.style.position = 'absolute';
            canvas.style.overflow = 'hidden';
            canvas.style.left = '24px';
            canvas.style.top = '26px';
            canvas.style.right = '0px';
            canvas.style.bottom = '0px';
            canvas.style.background = 'url("js/lib/images/grid.gif")';
            var model = new mxGraphModel();
            var graph = new mxGraph(canvas, model);
            graph.dropEnabled = true;

            mxDragSource.prototype.getDropTarget = function (graph, x, y) {
                var cell = graph.getCellAt(x, y);

                if (!graph.isValidDropTarget(cell)) {
                    cell = null;
                }

                return cell;
            };

            graph.setConnectable(true);
            graph.setMultigraph(false);

            this.addVertex('js/lib/images/swimlane.gif', 120, 160, 'shape=swimlane;startSize=20;', graph);
            this.addVertex('js/lib/images/rectangle.gif', 100, 40, '', graph);
            this.addVertex('js/lib/images/rounded.gif', 100, 40, 'shape=rounded', graph);
            this.addVertex('js/lib/images/ellipse.gif', 40, 40, 'shape=ellipse', graph);
            this.addVertex('js/lib/images/rhombus.gif', 40, 40, 'shape=rhombus', graph);
            this.addVertex('js/lib/images/triangle.gif', 40, 40, 'shape=triangle', graph);
            this.addVertex('js/lib/images/cylinder.gif', 40, 40, 'shape=cylinder', graph);
            this.addVertex('js/lib/images/actor.gif', 30, 40, 'shape=actor', graph);
            this.toolbar.addLine();
        },
        
        addToolbarItem(graph, toolbar, prototype, image){
        // Function that is executed when the image is dropped on
        // the graph. The cell argument points to the cell under
        // the mousepointer if there is one.
            var funct = function (graph, evt, cell) {
                graph.stopEditing(false);
                var pt = graph.getPointForEvent(evt);
                var vertex = graph.getModel().cloneCell(prototype);
                vertex.geometry.x = pt.x;
                vertex.geometry.y = pt.y;

                graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
            }
		    // Creates the image which is used as the drag icon (preview)
		    var img = toolbar.addMode(null, image, funct);
            mxUtils.makeDraggable(img, graph, funct);
        },
    },

    created: function () {
        mxConnectionHandler.prototype.connectImage = new mxImage('images/connector.gif', 16, 16);
        this.createToolbar();
        this.createCanvas();
    },
})
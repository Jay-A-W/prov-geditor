joint.shapes.deviceLink = joint.shapes.fsa.Arrow.extend({

    vertexMarkup: [
        '<g class="marker-vertex-group" transform="translate(<%= x %>, <%= y %>)">',
        '<circle class="marker-vertex" idx="<%= idx %>" r="1" />',
        '</g>'
    ].join(''),


    defaults: joint.util.deepSupplement({
        type: 'deviceLink',
        connection: { name: 'orthogonal' },
        attrs: {
            '.connection': { stroke: '#fe854f', 'stroke-width': 6 },
            sourcePort: { text: '' },
            targetPort: { text: '' },
            '.link-tools .tool-remove circle': { r: 8, fill: '#fff', position: 0.5 },
            customLabel: { text: '' },
            button: {
                cursor: 'pointer',
                ref: 'buttonLabel',
                refWidth: '150%',
                refHeight: '150%',
                refX: '-25%',
                refY: '-25%'
            },
            buttonLabel: {
                pointerEvents: 'none',
                refX: '100%',
                refY: 0,
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
                text: 'button'
            }
        },
        labels: [{ position: 0.5, attrs: { text: { text: '' } } }]
    }, joint.dia.Link.prototype.defaults),
});

joint.shapes.deviceLinkView = joint.dia.LinkView.extend({
    pointerclick: function (linkview, evt, x, y) {
        this.model.label(0, { attrs: { text: { text: 'new label' } } });
    },
});

joint.shapes.html = {};
joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
    attrs: {
        body: {
            rx: 10, // add a corner radius
            ry: 10,
            strokeWidth: 1,
            fill: 'yellow',
            magnet: true
        },
        label: {
            text: 'Entity',
            fill: 'black',
        }
    },
    defaults: joint.util.deepSupplement({
        type: 'html.Element',
        attrs: {
            rect: { stroke: 'none', 'fill-opacity': 0 },
            body: {
                rx: 10, // add a corner radius
                ry: 10,
                strokeWidth: 1,
                fill: 'yellow',
                magnet: true
            },
            label: {
                text: 'Entity',
                fill: 'black',
            }
        }
    }, joint.shapes.basic.Rect.prototype.defaults)
});

joint.shapes.html.ElementView = joint.dia.ElementView.extend({

    template: [
        '<div class="html-element">',
        '<button class="delete">x</button>',
        '<input type="text" value="I\'m HTML input" />',
        '</div>'
    ].join(''),

    attrs: {
        body: {
            rx: 10, // add a corner radius
            ry: 10,
            strokeWidth: 1,
            fill: 'yellow',
            magnet: true
        },
        label: {
            text: 'Entity',
            fill: 'black',
        }
    },

    initialize: function () {
        _.bindAll(this, 'updateBox');
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.$box = $(_.template(this.template)());
        // Prevent paper from handling pointerdown.
        //this.$box.find('input,select').on('mousedown click', function (evt) {
        //    evt.stopPropagation();
        //});
        // This is an example of reacting on the input change and storing the input data in the cell model.
        this.$box.find('input').on('change', _.bind(function (evt) {
            this.model.set('input', $(evt.target).val());
        }, this));
        this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
        // Update the box position whenever the underlying model changes.
        this.model.on('change', this.updateBox, this);
        // Remove the box when the model gets removed from the graph.
        this.model.on('remove', this.removeBox, this);

        this.updateBox();
    },
    render: function () {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.paper.$el.prepend(this.$box);
        this.updateBox();
        return this;
    },
    updateBox: function () {
        // Set the position and dimension of the box so that it covers the JointJS element.
        var bbox = this.model.getBBox();
        // Example of updating the HTML with a data stored in the cell model.
        this.$box.find('label').text(this.model.get('label'));
        this.$box.css({
            width: bbox.width,
            height: bbox.height,
            left: bbox.x,
            top: bbox.y,
            transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
        });
    },
    removeBox: function (evt) {
        this.$box.remove();
    }
});

joint.shapes.standard.Rectangle.define('custom.Entity', {
     attrs: {
        body: {
            rx: 10, // add a corner radius
            ry: 10,
            strokeWidth: 1,
            fill: 'yellow',
            magnet: true
        },
        label: {
            text: 'Entity',
            fill: 'black',
        }
    }
})

joint.shapes.standard.Rectangle.define('custom.Activity', {
    attrs: {
        body: {
            strokeWidth: 1,
            fill: 'cornflowerblue',
            magnet: true
        },
        label: {
            text: 'Activity',
            fill: 'black'
        }
    }
})

joint.dia.Element.define('custom.Agent', {
    type: 'custom.activity',
    size: { width: 100, height: 50 },
    attrs: {
        polygon: {
            points: '0,50 0,25 50,0 100,25 100,50',
            fill: 'green', stroke: 'black', 'stroke-width': 2,
            strokeLinejoin: 'round',
            magnet: true
        },
        label: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '75%',
            fontSize: 14,
            fill: 'black',
            text: 'agent'
        }
    }
}, {
        markup: [{
            tagName: 'polygon',
            selector: 'body',
        }, {
            tagName: 'text',
            selector: 'label'
        }]
    });

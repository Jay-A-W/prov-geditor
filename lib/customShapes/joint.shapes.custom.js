joint.dia.Link.define('custom.fsa.Arrow', { //Markup partially referenced from stack overflow
    attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } },
    smooth: true,
    toolMarkup: [
        '<g class="link-tool">',
        '<g class="tool-remove" event="tool:remove">',
        '<circle r="11" />',
        '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove link.</title>',
        '</g>',
        '</g>'
    ].join('')
});

joint.shapes.standard.Rectangle.define('custom.Entity', { //Generic attributes and markup referenced from Joint.js tutorials (true for each shape)
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

        },
        button: {
            cursor: 'pointer',
            ref: 'buttonLabel',
            refWidth: '150%',
            refHeight: '150%',
            refX: '-25%',
            refY: '-25%',
            event: 'delete:button:pointerdown',
            fill: 'orange',
            stroke: 'black',
            strokeWidth: 2,
            visibility: true
        },
        buttonLabel: {
            pointerEvents: 'none',
            refX: '100%',
            refY: 0,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            text: "✖", 
            fill: 'black',
            fontSize: 10,
            fontWeight: 'bold'
        }
     },
    markup: [{
        tagName: 'rect',
        selector: 'body',
    }, {
        tagName: 'text',
        selector: 'label'
    }, {
        tagName: 'rect',
        selector: 'button'
    }, {
        tagName: 'text',
        selector: 'buttonLabel'
    }]

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
        },
        button: {
            cursor: 'pointer',
            ref: 'buttonLabel',
            refWidth: '150%',
            refHeight: '150%',
            refX: '-25%',
            refY: '-25%',
            event: 'delete:button:pointerdown',
            fill: 'orange',
            stroke: 'black',
            strokeWidth: 2,
            visibility: true
        },
        buttonLabel: {
            pointerEvents: 'none',
            refX: '100%',
            refY: 0,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            text: "✖", 
            fill: 'black',
            fontSize: 10,
            fontWeight: 'bold'
        }
    },
    markup: [{
        tagName: 'rect',
        selector: 'body',
    }, {
        tagName: 'text',
        selector: 'label'
    }, {
        tagName: 'rect',
        selector: 'button'
    }, {
        tagName: 'text',
        selector: 'buttonLabel'
    }]
})

joint.dia.Element.define('custom.Agent', {
    size: { width: 100, height: 50 },
    attrs: {
        polygon: { //The points draw the shape of the polygon
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
        },
        button: {
            cursor: 'pointer',
            ref: 'buttonLabel',
            refWidth: '150%',
            refHeight: '150%',
            refX: '-25%',
            refY: '-25%',
            event: 'delete:button:pointerdown',
            fill: 'orange',
            stroke: 'black',
            strokeWidth: 2,
            visibility: true
        },
        buttonLabel: {
            pointerEvents: 'none',
            refX: '100%',
            refY: 0,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            text: "✖",
            fill: 'black',
            fontSize: 10,
            fontWeight: 'bold'
        }
    }
}, {
        markup: [{
            tagName: 'polygon',
            selector: 'body',
        }, {
            tagName: 'text',
            selector: 'label'
        }, {
            tagName: 'rect',
            selector: 'button'
        }, {
            tagName: 'text',
            selector: 'buttonLabel'
        }]
    });

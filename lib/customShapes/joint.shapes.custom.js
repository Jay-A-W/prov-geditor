joint.shapes.standard.Rectangle.define('custom.entity', {
     attrs: {
        body: {
            rx: 10, // add a corner radius
            ry: 10,
            strokeWidth: 1,
            fill: 'yellow'
        },
        label: {
            text: 'Entity',
            fill: 'black'
        }
    }
})

joint.shapes.standard.Rectangle.define('custom.activity', {
    attrs: {
        body: {
            strokeWidth: 1,
            fill: 'cornflowerblue'
        },
        label: {
            text: 'Activity',
            fill: 'black'
        }
    }
})

joint.dia.Element.define('custom.agent', {
    type: 'custom.activity',
    size: { width: 100, height: 50 },
    attrs: {
        polygon: {
            points: '0,50 0,25 50,0 100,25 100,50',
            fill: 'green', stroke: 'black', 'stroke-width': 2,
            strokeLinejoin: 'round',
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

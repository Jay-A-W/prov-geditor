function URI(uri) {
    this.uri = uri;
}
URI.prototype.getURI = function () {
    return this.uri;
};

// PROV Record
function Record() {
    var i, l;
    // Parsing the optional attribute-value pairs if the last argument is a list
    this.attributes = [];
    var len = arguments.length;
    if (len > 1 && arguments[len - 1] instanceof Array) {
        // Requiring at least 3 arguments (record-specific first term, an array)
        var attrPairs = arguments[len - 1];
        for (i = 0, l = attrPairs.length; i < l; i += 2) {
            requireQualifiedName(attrPairs[i]);
            this.setAttr(attrPairs[i], attrPairs[i + 1]);
        }
    }
}
Record.prototype = {
    /* GETTERS & SETTERS */
    // Identifier
    id: function (identifier) {
        this.identifier = identifier;
        return this;
    },
    getId: function () {
        return this.identifier;
    },
    setAttr: function (k, v) {
        var i;
        var existing = false;
        var values = this.getAttr(k);
        for (i = 0; i < values.length; i++) {
            if (v.equals(values[i])) {
                existing = true;
                break;
            }
        }
        if (!existing) {
            this.attributes.push([k, v]);
        }
    },

    // Arbitrary attributes
    getAttr: function (attr_name) {
        var i;
        var results = [];
        for (i = 0; i < this.attributes.length; i++) {
            if (attr_name.equals(this.attributes[i][0])) {
                results.push(this.attributes[i][1]);
            }
        }
        return results;
    }
};
// Element
function Element(identifier) {
    Record.apply(this, arguments);
    this.identifier = identifier;
}
Element.prototype = Object.create(Record.prototype);
Element.prototype.constructor = Element;

// Entity
function Entity(identifier) {
    Element.apply(this, arguments);
}
Entity.prototype = Object.create(Element.prototype);
Entity.prototype.constructor = Entity;
Entity.prototype.provn_name = "entity";
Entity.prototype.toString = function () {
    var output = [];
    output.push(String(this.identifier));
    var attr = this.attributes.map(function (x) {
        return x.join("=");
    }).join(", ");
    if (attr !== "") {
        output.push("[" + attr + "]");
    }
    return Entity.prototype.provn_name + "(" + output.join(", ") + ")";
};

// PROV Qualified Name
function QualifiedName(prefix, localPart, namespaceURI) {
    this.prefix = prefix;
    this.localPart = localPart;
    this.namespaceURI = namespaceURI;
    URI.call(this, namespaceURI + localPart);
}
QualifiedName.prototype = Object.create(URI.prototype);
QualifiedName.prototype.constructor = QualifiedName;
QualifiedName.prototype.toString = function () {
    if (this.prefix == "default") {
        var ret = this.localPart;
    } else {
        var ret = this.prefix + ":" + this.localPart;
    }
    return ret;
};
QualifiedName.prototype.equals = function (other) {
    return ((other instanceof QualifiedName) &&
        (this.namespaceURI === other.namespaceURI) &&
        (this.localPart === other.localPart)
    );
};


URI.prototype.getProvJSON = function () {
    return { '$': this.getURI(), 'type': 'xsd:anyURI' };
};
QualifiedName.prototype.getProvJSON = function () {
    return { '$': this.toString(), 'type': 'prov:QUALIFIED_NAME' };
};
function _getProvJSON(value) {
    var i, l;
    if (value && typeof value.getProvJSON === 'function') {
        return value.getProvJSON();
    }
    if (typeof value === 'array') {
        var values = [];
        for (i = 0, l = value.length; i < l; i++) {
            values.push(_getProvJSON(value[i]));
        }
        return values;
    }
    if (value instanceof Date) {
        return { '$': value.toISOString(), 'type': 'xsd:dateTime' };
    }
    return value;
}

function Namespace(prefix, namespaceURI, predefined) {
    var i, l;
    this.prefix = prefix;
    this.namespaceURI = namespaceURI;
    if (predefined !== undefined) {
        for (i = 0, l = predefined.length; i < l; i++) {
            this.qn(predefined[i]);
        }
    }
}
Namespace.prototype.qn = function (localPart) {
    if (!this.hasOwnProperty(localPart)) {
        this[localPart] = new QualifiedName(this.prefix, localPart, this.namespaceURI);
    }
    return this[localPart];
}
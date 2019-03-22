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

function addNamespaceNotParent(doc, ns_or_prefix, uri) { //Original function will add the ns to the parent based on a condition, this doesn't
    var ns;
    //this._documentOnly();
    if (ns_or_prefix instanceof Namespace) {
        ns = ns_or_prefix;
    } else {
        ns = new Namespace(ns_or_prefix, uri);
    }
    var namespaces = doc.scope.namespaces;
    namespaces[ns.prefix] = ns;
    return ns;
}

function getProvAsJSON(doc) {
    return doc.scope.getProvJSON();
}
function insensitiveStringCompare(string1, string2) {
    return typeof string1 === 'string' && typeof string2 === 'string'
        ? string1.localeCompare(string2, undefined, { sensitivity: 'accent' }) === 0
        : string1 === string2;
}

function getValidDate(dt) {
    var ret;
    if (dt instanceof Date) {
        ret = new Date(dt);
    } else if (typeof dt === "string") {
        ret = new Date(Date.parse(dt));
    } else if (typeof dt === "number") {
        ret = new Date(dt);
    }
    return ret;
}

function getElementById(id) {
    for (let element of graph.getElements()) {
        if (element.id === id) {
            return element;
        }
    }
};

function filterForLink(link, relType) {
    let source = getElementById(link.attributes.source.id);
    let target = getElementById(link.attributes.target.id);
    let sourceType = source.attributes.type.replace("custom.", "");
    let targetType = target.attributes.type.replace("custom.", "");
    let filtered;
    function filterLink(link, qualifiedInfluence) {
        let filtered = doc.scope.statements.filter(function (link) {
            if (link.constructor.name == qualifiedInfluence) {
                if ((link.properties.hasOwnProperty(sourceType.toLowerCase())) && (link.properties.hasOwnProperty(targetType.toLowerCase()))) {
                    if ((link[sourceType.toLowerCase()].localPart == source.attributes.attrs.label.text) && (link[targetType.toLowerCase()].localPart == target.attributes.attrs.label.text)) {
                        return true;
                    }
                }
            }
            return false;
        });
        return filtered;
    }

    switch (relType) {
        case "wasGeneratedBy":
            qualifiedInfluence = "Generation";
            filtered = filterLink(link, qualifiedInfluence);
            break;
        case "wasDerivedFrom":
            qualifiedInfluence = "Derivation";
            filtered = doc.scope.statements.filter(function (link) {
                if (link.constructor.name == qualifiedInfluence) {
                    if ((link.properties.hasOwnProperty('generatedEntity') && (link.properties.hasOwnProperty('usedEntity')))) {
                        if ((link['generatedEntity'].localPart == source.attributes.attrs.label.text) && (link['usedEntity'].localPart == target.attributes.attrs.label.text)) {
                            return true;
                        }
                    }
                }
                return false;
            });
            break;
        case "wasAttributedTo":
            qualifiedInfluence = "Attribution";
            filtered = filterLink(link, qualifiedInfluence);
            break;
        case "used":
            qualifiedInfluence = "Usage";
            filtered = filterLink(link, qualifiedInfluence);
            break;
        case "wasInformedBy":
            qualifiedInfluence = "Communication";
            filtered = doc.scope.statements.filter(function (link) {
                if (link.constructor.name == qualifiedInfluence) {
                    if ((link.properties.hasOwnProperty('informed') && (link.properties.hasOwnProperty('informant')))) {
                        if ((link['informed'].localPart == source.attributes.attrs.label.text) && (link['informant'].localPart == target.attributes.attrs.label.text)) {
                            return true;
                        }
                    }
                }
                return false;
            });
       
            break;
        case "wasAssociatedWith":
            qualifiedInfluence = "Association";
            filtered = filterLink(link, qualifiedInfluence);
            break;
        case "actedOnBehalfOf":
            qualifiedInfluence = "Delegation";
            filtered = doc.scope.statements.filter(function (link) {
                if (link.constructor.name == qualifiedInfluence) {
                    if ((link.properties.hasOwnProperty('delegate') && (link.properties.hasOwnProperty('responsible')))) {
                        if ((link['delegate'].localPart == source.attributes.attrs.label.text) && (link['responsible'].localPart == target.attributes.attrs.label.text)) {
                            return true;
                        }
                    }
                }
                return false;
            });
            break;
        case "wasInfluencedBy":
            qualifiedInfluence = "Influence";
            filtered = doc.scope.statements.filter(function (link) {
                if (link.constructor.name == qualifiedInfluence) {
                    if ((link.properties.hasOwnProperty('influencee') && (link.properties.hasOwnProperty('influencer')))) {
                        if ((link['influencee'].localPart == source.attributes.attrs.label.text) && (link['influencer'].localPart == target.attributes.attrs.label.text)) {
                            return true;
                        }
                    }
                }
                return false;
            });
            break;
        case "hadPrimarySource":
            qualifiedInfluence = "PrimarySource";
            filtered = filterLink(link, qualifiedInfluence);
            break;
        case "wasQuotedFrom":
            qualifiedInfluence = "Quotation";
            filtered = filterLink(link, qualifiedInfluence);
            break;
        case "wasRevisionOf":
            qualifiedInfluence = "Revision";
            filtered = filterLink(link, qualifiedInfluence);
            break;
        case "wasInvalidatedBy":
            qualifiedInfluence = "Invalidation";
            filtered = filterLink(link, qualifiedInfluence);
             break;
        case "wasStartedBy":
            qualifiedInfluence = "Start";
            filtered = doc.scope.statements.filter(function (link) {
                if (link.constructor.name == qualifiedInfluence) {
                    if ((link.properties.hasOwnProperty(sourceType.toLowerCase()) && (link.properties.hasOwnProperty('trigger')))) {
                        if ((link[sourceType.toLowerCase()].localPart == source.attributes.attrs.label.text) && (link['trigger'].localPart == target.attributes.attrs.label.text)) {
                            return true;
                        }
                    }
                }
                return false;
            });
            break;
        case "wasEndedBy":
            qualifiedInfluence = "End";
            filtered = doc.scope.statements.filter(function (link) {
                if (link.constructor.name == qualifiedInfluence) {
                    if ((link.properties.hasOwnProperty(sourceType.toLowerCase()) && (link.properties.hasOwnProperty('trigger')))) {
                        if ((link[sourceType.toLowerCase()].localPart == source.attributes.attrs.label.text) && (link['trigger'].localPart == target.attributes.attrs.label.text)) {
                            return true;
                        }
                    }
                }
                return false;
            });
            break;
    }
    return filtered;
}

function filterOutLink(link, qualifiedInfluence) {
    let source = getElementById(link.attributes.source.id);
    let target = getElementById(link.attributes.target.id);
    let sourceType = source.attributes.type.replace("custom.", "");
    let targetType = target.attributes.type.replace("custom.", "");
    let filtered = doc.scope.statements.filter(function (link) {
        if (link.constructor.name == qualifiedInfluence) {
            if ((link.properties.hasOwnProperty(sourceType.toLowerCase())) && (link.properties.hasOwnProperty(targetType.toLowerCase()))) {
                if ((link[sourceType.toLowerCase()].localPart == source.attributes.attrs.label.text) && (link[targetType.toLowerCase()].localPart == target.attributes.attrs.label.text)) {
                    return false;
                }
            }
        }
        return true;
    });
    return filtered;
}

function localStoreSaveStatements() {
    let statementJsonMap = {};
    let statements = [];
    for (let statement of doc.scope.statements) {
        //attributesJsonMap.
    }
    for (let i = 0; i < doc.scope.statements.length; i++) {

        let statement = {};
        statement.objectType = doc.scope.statements[i].constructor.name;
        let attributes = [];
        let identifier = {};
        let properties = {};
        let source = {};
        let target = {};
        statement.properties = properties;
        for (let j = 0; j < doc.scope.statements[i].attributes.length; j++) {
            let attribute = [];
            attributes.push(attribute);
            for (let k = 0; k < doc.scope.statements[i].attributes[j].length; k++) {
                let attributeData = {};
                attributeData.objectType = doc.scope.statements[i].attributes[j][k].constructor.name;
                attributeData.jsonProvData = doc.scope.statements[i].attributes[j][k];
                attributes[j].push(attributeData);
            }
        }
        if ((statement.objectType == "Activity") && (doc.scope.statements[i].hasOwnProperty("startTime")) && (doc.scope.statements[i].hasOwnProperty("endTime"))) {
            statement.startTime = doc.scope.statements[i].startTime;
            statement.endTime = doc.scope.statements[i].endTime;
        }
        if (doc.scope.statements[i].hasOwnProperty("identifier")) { //elements have identifiers
            identifier.objectType = doc.scope.statements[i].identifier.constructor.name;
            identifier.jsonProvData = doc.scope.statements[i].identifier;
            statement.identifier = identifier;
        } else { //links do not have identifiers
            switch (statement.objectType) {
                case "Generation":
                    source.prefix = doc.scope.statements[i].properties.entity.prefix;
                    source.localPart = doc.scope.statements[i].properties.entity.localPart;
                    target.prefix = doc.scope.statements[i].properties.activity.prefix;
                    target.localPart = doc.scope.statements[i].properties.activity.localPart;
                    source.objectType = "Entity";
                    target.objectType = "Activity";
                    if (doc.scope.statements[i].properties.hasOwnProperty("time")) {
                        statement.properties.time = getValidDate(doc.scope.statements[i].properties.time);
                    }
                    break;
                case "Derivation":
                    source.prefix = doc.scope.statements[i].properties.generatedEntity.prefix;
                    source.localPart = doc.scope.statements[i].properties.generatedEntity.localPart;
                    target.prefix = doc.scope.statements[i].properties.usedEntity.prefix;
                    target.localPart = doc.scope.statements[i].properties.usedEntity.localPart;
                    source.objectType = "Entity";
                    target.objectType = "Entity";
                    break;
                case "Attribution":
                    source.prefix = doc.scope.statements[i].properties.entity.prefix;
                    source.localPart = doc.scope.statements[i].properties.entity.localPart;
                    target.prefix = doc.scope.statements[i].properties.agent.prefix;
                    target.localPart = doc.scope.statements[i].properties.agent.localPart;
                    source.objectType = "Entity";
                    target.objectType = "Agent";
                    break;
                case "Usage":
                    source.prefix = doc.scope.statements[i].properties.activity.prefix;
                    source.localPart = doc.scope.statements[i].properties.activity.localPart;
                    target.prefix = doc.scope.statements[i].properties.entity.prefix;
                    target.localPart = doc.scope.statements[i].properties.entity.localPart;
                    source.objectType = "Activity";
                    target.objectType = "Entity";
                    break;
                case "Communication":
                    source.prefix = doc.scope.statements[i].properties.informed.prefix;
                    source.localPart = doc.scope.statements[i].properties.informed.localPart;
                    target.prefix = doc.scope.statements[i].properties.informant.prefix;
                    target.localPart = doc.scope.statements[i].properties.informant.localPart;
                    source.objectType = "Informed";
                    target.objectType = "Informant";
                    break;
                case "Association":
                    source.prefix = doc.scope.statements[i].properties.activity.prefix;
                    source.localPart = doc.scope.statements[i].properties.activity.localPart;
                    target.prefix = doc.scope.statements[i].properties.agent.prefix;
                    target.localPart = doc.scope.statements[i].properties.agent.localPart;
                    source.objectType = "Activity";
                    target.objectType = "Agent";
                    break;
                case "Delegation":
                    source.prefix = doc.scope.statements[i].properties.delegate.prefix;
                    source.localPart = doc.scope.statements[i].properties.delegate.localPart;
                    target.prefix = doc.scope.statements[i].properties.responsible.prefix;
                    target.localPart = doc.scope.statements[i].properties.responsible.localPart;
                    source.objectType = "Delegate";
                    target.objectType = "Responsible";
                    break;
                case "Influence":
                    source.prefix = doc.scope.statements[i].properties.influencee.prefix;
                    source.localPart = doc.scope.statements[i].properties.influencee.localPart;
                    target.prefix = doc.scope.statements[i].properties.influencer.prefix;
                    target.localPart = doc.scope.statements[i].properties.influencer.localPart;
                    source.objectType = "Influencee";
                    target.objectType = "Influencer";
                    break;
                case "PrimarySource":
                    //Cannot do PrimarySource relation with current Prov API         
                    break;
                case "Quotation":
                    //Cannot do Quotation relation with current Prov API 
                    break;
                case "Revision":
                     //Cannot do Revision relation with current Prov API 
                    break;
                case "Invalidation":
                    source.prefix = doc.scope.statements[i].properties.entity.prefix;
                    source.localPart = doc.scope.statements[i].properties.entity.localPart;
                    target.prefix = doc.scope.statements[i].properties.activity.prefix;
                    target.localPart = doc.scope.statements[i].properties.activity.localPart;
                    source.objectType = "Entity";
                    target.objectType = "Activity";
                    break;
                case "Start":
                    source.prefix = doc.scope.statements[i].properties.activity.prefix;
                    source.localPart = doc.scope.statements[i].properties.activity.localPart;
                    target.prefix = doc.scope.statements[i].properties.trigger.prefix;
                    target.localPart = doc.scope.statements[i].properties.trigger.localPart;
                    source.objectType = "Activity";
                    target.objectType = "Trigger";
                    break;
                case "End":
                    source.prefix = doc.scope.statements[i].properties.activity.prefix;
                    source.localPart = doc.scope.statements[i].properties.activity.localPart;
                    target.prefix = doc.scope.statements[i].properties.trigger.prefix;
                    target.localPart = doc.scope.statements[i].properties.trigger.localPart;
                    source.objectType = "Activity";
                    target.objectType = "Trigger";
                    break;
            }
            statement.properties.source = source;
            statement.properties.target = target;
        }
        statement.attributes = attributes;
        statements.push(statement);
    }
    localStorage.setItem("statements", JSON.stringify(statements));
    return statements;
}

function editPROVElement(type, currentName, newName, prefix, startTime, endTime) {
    var ex = doc.addNamespace("ex", "http://www.example.org#");
    let provElement = doc.scope.statements.filter(elementType => elementType.constructor.name == type).filter(element => element.identifier.localPart == currentName);
    if (provElement.length != 0) {

        let prevName = provElement[0].identifier.localPart;
        provElement[0].identifier.prefix = prefix;
        provElement[0].identifier.localPart = newName;
        provElement[0].identifier.uri = provElement[0].identifier.uri.replace(prevName, newName);

        if ((startTime != "") && (endTime != "")) {
            provElement[0].startTime = getValidDate(startTime);
            provElement[0].endTime = getValidDate(endTime);
        }

    } else {
        let justType = type.replace("custom.", "")
        let attrs = [];
        switch (justType) {
            case 'Entity':
                //item = new joint.shapes.custom.Entity();
                //item.attr('label/text', newName);
                //item.attr('prefix', prefix);
                store.state.currentElement.model.attr('prefix/text', prefix);
                let entity = doc.entity(prefix + ":" + newName);
                break;

            case 'Activity':
                //item = new joint.shapes.custom.Activity();
                //item.attr('label/text', newName);
                //item.attr('prefix', prefix);
                store.state.currentElement.model.attr('prefix/text', prefix);
                let activity = doc.activity(prefix + ":" + newName, startTime, endTime);
                break;

            case 'Agent':
                //item = new joint.shapes.custom.Agent();
                //item.attr('label/text', newName);
                //item.attr('prefix', prefix);
                store.state.currentElement.model.attr('prefix/text', prefix);
                let agent = doc.agent(prefix + ":" + newName);
                break;
            default:
                throw new Error('Invalid item type');
        }
    }
}

function loadStatements(localStatementData) {
    let localStatements = localStatementData;
    doc.scope.statements = [];

    function addAttr(objectType, localStatement) {
        let provElement = doc.scope.statements.filter(elementType => elementType.constructor.name == objectType).filter(element => element.identifier.localPart == localStatement.identifier.jsonProvData.localPart);
        for (let j = 0; j < localStatement.attributes.length; j++) {
            let attribute = localStatement.attributes[j];
            let qnName = new QualifiedName(attribute[0].jsonProvData.prefix, attribute[0].jsonProvData.localPart, attribute[0].jsonProvData.namespaceURI);
            if (attribute[0].jsonProvData.prefix == "prov") {
                let qnValue = new QualifiedName(attribute[1].jsonProvData.prefix, attribute[1].jsonProvData.localPart, attribute[1].jsonProvData.namespaceURI);
                provElement[0].attributes.push([qnName, qnValue]);
            } else {
                provElement[0].attributes.push([qnName, attribute[1].jsonProvData]);
            }
        }
        if ((objectType == "Activity") && (localStatement.hasOwnProperty("startTime")) && (localStatement.hasOwnProperty("endTime"))) {
            provElement[0].startTime = getValidDate(localStatement.startTime);
            provElement[0].endTime = getValidDate(localStatement.endTime);
        }
    }

    function filterForLinkWithStatement(objectType, localStatement) {
        let source = localStatement.properties.source;
        let target = localStatement.properties.target;
        let provLink = doc.scope.statements.filter(linkType => linkType.constructor.name == objectType).filter(function (link) {
            if ((link.properties.hasOwnProperty(source.objectType.toLowerCase())) && (link.properties.hasOwnProperty(target.objectType.toLowerCase()))) {
                if ((link.properties[source.objectType.toLowerCase()].localPart == source.localPart) && (link.properties[target.objectType.toLowerCase()].localPart == target.localPart)
                    && (link.properties[source.objectType.toLowerCase()].prefix == source.prefix) && (link.properties[target.objectType.toLowerCase()].prefix == target.prefix)) {
                    return true;
                }
            }
            return false;
        });
        return provLink;
    }

    function addAttrToLink(objectType, localStatement) {
        let provLink = filterForLinkWithStatement(objectType, localStatement);
        for (let j = 0; j < localStatement.attributes.length; j++) {
            let attribute = localStatement.attributes[j];
            let qnName = new QualifiedName(attribute[0].jsonProvData.prefix, attribute[0].jsonProvData.localPart, attribute[0].jsonProvData.namespaceURI);
            if (attribute[0].jsonProvData.prefix == "prov") {
                let qnValue = new QualifiedName(attribute[1].jsonProvData.prefix, attribute[1].jsonProvData.localPart, attribute[1].jsonProvData.namespaceURI);
                provLink[0].attributes.push([qnName, qnValue]);
            } else {
                provLink[0].attributes.push([qnName, attribute[1].jsonProvData]);
            }
        }
        if ((objectType == "Generation") && (localStatement.properties.hasOwnProperty("time"))) {
            provLink[0].properties.time = getValidDate(localStatement.properties.time);
        }
    }

    for (let i = 0; i < localStatements.length; i++) {
        let objectType = localStatements[i].objectType;
        if (localStatements[i].hasOwnProperty("properties")) {
            source = localStatements[i].properties.source;
            target = localStatements[i].properties.target;
        }
        switch (objectType) {
            case 'Entity':
                doc.entity(localStatements[i].identifier.jsonProvData.prefix + ":" + localStatements[i].identifier.jsonProvData.localPart);
                addAttr("Entity", localStatements[i]);
                break;
            case 'Activity':
                doc.activity(localStatements[i].identifier.jsonProvData.prefix + ":" + localStatements[i].identifier.jsonProvData.localPart);
                addAttr("Activity", localStatements[i]);
                break;
            case 'Agent':
                doc.agent(localStatements[i].identifier.jsonProvData.prefix + ":" + localStatements[i].identifier.jsonProvData.localPart);
                addAttr("Agent", localStatements[i]);
                break;
            case "Generation":
                doc.wasGeneratedBy(source.prefix + ":" + source.localPart, target.prefix + ":" + target.localPart);
                addAttrToLink("Generation", localStatements[i]);
                break;
            case "Derivation":
                doc.wasDerivedFrom(source.prefix + ":" + source.localPart, target.prefix + ":" + target.localPart);
                addAttrToLink("Derivation", localStatements[i]);
                break;
            case "Attribution":
                doc.wasAttributedTo(source.prefix + ":" + source.localPart, target.prefix + ":" + target.localPart);
                addAttrToLink("Attribution", localStatements[i]);
                break;
            case "Usage":
                doc.used(source.prefix + ":" + source.localPart, target.prefix + ":" + target.localPart);
                addAttrToLink("Usage", localStatements[i]);
                break;
            case "Communication":
                doc.wasInformedBy(source.prefix + ":" + source.localPart, target.prefix + ":" + target.localPart);
                addAttrToLink("Communication", localStatements[i]);
                break;
            case "Association":
                doc.wasAssociatedWith(source.prefix + ":" + source.localPart, target.prefix + ":" + target.localPart);
                addAttrToLink("Association", localStatements[i]);
                break;
            case "Delegation":
                doc.actedOnBehalfOf(source.prefix + ":" + source.localPart, target.prefix + ":" + target.localPart);
                addAttrToLink("Delegation", localStatements[i]);
                break;
            case "Influence":
                doc.wasInfluencedBy(source.prefix + ":" + source.localPart, target.prefix + ":" + target.localPart);
                addAttrToLink("Influence", localStatements[i]);
                break;
            case "PrimarySource":
                //Cannot do PrimarySource relation with current Prov API
                break;
            case "Quotation":
                //Cannot do Quotation relation with current Prov API
                break;
            case "Revision":
                //Cannot do Revision relation with current Prov API
                break;
            case "Invalidation":
                doc.wasInvalidatedBy(source.prefix + ":" + source.localPart, target.prefix + ":" + target.localPart);
                addAttrToLink("Invalidation", localStatements[i]);
                break;
            case "Start":
                doc.wasStartedBy(source.prefix + ":" + source.localPart, target.prefix + ":" + target.localPart);
                addAttrToLink("Start", localStatements[i]);
                break;
            case "End":
                doc.wasEndedBy(source.prefix + ":" + source.localPart, target.prefix + ":" + target.localPart);
                addAttrToLink("End", localStatements[i]);
                break;
        }
    }
}
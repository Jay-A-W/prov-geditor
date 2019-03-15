function setPrefixInDoc() {

}

//function QualifiedName(prefix, localPart, namespaceURI) {
//    console.log(prefix, localPart, namespaceURI);
//    this.prefix = prefix;
//    this.localPart = localPart;
//    this.namespaceURI = namespaceURI;
//    if (namespaceURI[namespaceURI.length - 1] == "/") {
//        this.uri = namespaceURI + localPart;
//    } else {
//        this.uri = namespaceURI + "/" + localPart;
//    }
//}

function URI(uri) {
    this.uri = uri;
}
URI.prototype.getURI = function () {
    return this.uri;
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
    console.log(sourceType, targetType);
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
                item = new joint.shapes.custom.Entity();
                item.attr('label/text', newName);
                item.attr('prefix', prefix);
                let entity = doc.entity(prefix + ":" + newName, ["prov:type", prov.ns.Entity]);
                break;

            case 'Activity':
                item = new joint.shapes.custom.Activity();
                item.attr('label/text', newName);
                item.attr('prefix', prefix);
                let activity = doc.activity(prefix + ":" + newName, startTime, endTime, ["prov:type", prov.ns.Activity]);
                break;

            case 'Agent':
                item = new joint.shapes.custom.Agent();
                item.attr('label/text', newName);
                item.attr('prefix', prefix);
                let agent = doc.agent(prefix + ":" + newName, ["prov:type", prov.ns.Agent]);
                break;
            default:
                throw new Error('Invalid item type');
        }
    }
};
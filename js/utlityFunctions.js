function addNamespaceNotParent(doc, ns_or_prefix, uri) { //Original function will add the ns to the parent based on a condition, this doesn't (Taken from Prov.js)
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

function getProvAsJSON(doc) { //Returns PROV Document data as JSON
    return doc.scope.getProvJSON();
}
function insensitiveStringCompare(stringA, stringB) { //Compares 2 strings ignoring case 
    return stringA.toUpperCase() === stringB.toUpperCase();
}

function getValidDate(dt) { //Taken from prov.js
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

function getElementById(id) { //Retrieves an element from joint graph object based on the joint id.
    for (let element of graph.getElements()) {
        if (element.id === id) {
            return element;
        }
    }
};

function filterForLink(link, relType) { //Retrieves link from PROV document using data retrieved from joint graph link object
    let source = getElementById(link.attributes.source.id);
    let target = getElementById(link.attributes.target.id);
    let sourceType = source.attributes.type.replace("custom.", "");
    let targetType = target.attributes.type.replace("custom.", "");
    let filtered;
    function filterLink(link, qualifiedInfluence) { //Retrieves link from set of statements based on the source and target and object name
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

    switch (relType) { //Each relation type has a different qualified influence and potentially different source and target object names
        case "wasGeneratedBy":
            qualifiedInfluence = "Generation";
            filtered = filterLink(link, qualifiedInfluence);
            break;
        case "wasDerivedFrom":
            qualifiedInfluence = "Derivation";
            filtered = doc.scope.statements.filter(function (link) { //Whilst an entity to entity relation the source and target entities are named differently "generated" vs "used" to differentiate them
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

function filterOutLink(link, qualifiedInfluence) { //Remove specific link from statements
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

function localStoreSaveStatements() { //Save statements to localStore
    let statements = [];
    for (let i = 0; i < doc.scope.statements.length; i++) { //As local storage does not save metadata of object I need to retrieve the specific data I want rather than the whole statement object to repopulate the object with local data later

        let statement = {};
        statement.objectType = doc.scope.statements[i].constructor.name;
        let attributes = [];
        let identifier = {};
        let properties = {};
        let source = {};
        let target = {};
        statement.properties = properties;
        for (let j = 0; j < doc.scope.statements[i].attributes.length; j++) { //Getting the attributes of a statement
            let attribute = [];
            attributes.push(attribute);
            for (let k = 0; k < doc.scope.statements[i].attributes[j].length; k++) { //[i][0] holds the qualified name of an attribute, [i][1] holds the value of the attribute
                let attributeData = {};
                attributeData.objectType = doc.scope.statements[i].attributes[j][k].constructor.name;
                attributeData.jsonProvData = doc.scope.statements[i].attributes[j][k];
                attributes[j].push(attributeData);
            }
        }
        if ((statement.objectType == "Activity") && (doc.scope.statements[i].hasOwnProperty("startTime")) && (doc.scope.statements[i].hasOwnProperty("endTime"))) { //PROV Doc stores activity start and end time differently
            statement.startTime = doc.scope.statements[i].startTime;
            statement.endTime = doc.scope.statements[i].endTime;
        }
        if (doc.scope.statements[i].hasOwnProperty("identifier")) { //elements have identifiers
            identifier.objectType = doc.scope.statements[i].identifier.constructor.name;
            identifier.jsonProvData = doc.scope.statements[i].identifier;
            statement.identifier = identifier;
        } else { //links do not have identifiers
            switch (statement.objectType) { //The source and target object type is different depending on the relation so each case must be taken into account
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
                    //Cannot do PrimarySource relation with current Prov API due to missing functionality    
                    break;
                case "Quotation":
                    //Cannot do Quotation relation with current Prov API due to missing functionality
                    break;
                case "Revision":
                     //Cannot do Revision relation with current Prov API due to missing functionality
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

function editPROVElement(type, currentName, newName, prefix, startTime, endTime) { //Edit function of the PROV Editor calls this
    let provElement = doc.scope.statements.filter(elementType => elementType.constructor.name == type).filter(element => element.identifier.localPart == currentName); //Retrieve element from PROV doc
    if (provElement.length != 0) { //If element exists in PROV doc we edit it by modifying the PROV doc element

        let prevName = provElement[0].identifier.localPart;
        provElement[0].identifier.prefix = prefix;
        provElement[0].identifier.localPart = newName;
        provElement[0].identifier.uri = provElement[0].identifier.uri.replace(prevName, newName);

        if ((startTime != "") && (endTime != "")) {
            provElement[0].startTime = getValidDate(startTime);
            provElement[0].endTime = getValidDate(endTime);
        }

    } else { //If element is newly created with no PROV doc data we create a new element in the PROV doc
        let justType = type.replace("custom.", "")
        let attrs = [];
        switch (justType) {
            case 'Entity':
                store.state.currentElement.model.attr('prefix/text', prefix);
                let entity = doc.entity(prefix + ":" + newName);
                break;

            case 'Activity':
                store.state.currentElement.model.attr('prefix/text', prefix);
                let activity = doc.activity(prefix + ":" + newName, startTime, endTime);
                break;

            case 'Agent':
                store.state.currentElement.model.attr('prefix/text', prefix);
                let agent = doc.agent(prefix + ":" + newName);
                break;
            default:
                throw new Error('Invalid item type');
        }
    }
}

function loadStatements(localStatementData) { //Loads statement data from localStorage into PROV doc
    let localStatements = localStatementData;
    doc.scope.statements = [];

    function addAttr(objectType, localStatement) { //Adds attribute to PROV Doc element manually as functionality does not exist in Prov.js
        let provElement = doc.scope.statements.filter(elementType => elementType.constructor.name == objectType).filter(element => element.identifier.localPart == localStatement.identifier.jsonProvData.localPart);
        for (let j = 0; j < localStatement.attributes.length; j++) {
            let attribute = localStatement.attributes[j];
            let qnName = new QualifiedName(attribute[0].jsonProvData.prefix, attribute[0].jsonProvData.localPart, attribute[0].jsonProvData.namespaceURI);
            if (attribute[0].jsonProvData.prefix == "prov") { //If attribute prefix is prov then the value must be a qualified name to be valid
                let qnValue = new QualifiedName(attribute[1].jsonProvData.prefix, attribute[1].jsonProvData.localPart, attribute[1].jsonProvData.namespaceURI);
                provElement[0].attributes.push([qnName, qnValue]);
            } else {
                provElement[0].attributes.push([qnName, attribute[1].jsonProvData]);
            }
        }
        if ((objectType == "Activity") && (localStatement.hasOwnProperty("startTime")) && (localStatement.hasOwnProperty("endTime"))) { //Loading start and end time for activities if it exists
            provElement[0].startTime = getValidDate(localStatement.startTime); //localStorage time data loses it's valid format/metadata when stored, getValidDate ensures it is in valid date format
            provElement[0].endTime = getValidDate(localStatement.endTime);
        }
    }

    function addAttrToLink(objectType, localStatement) { //Adds an attribute to link
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


    function filterForLinkWithStatement(objectType, localStatement) { //Retrieves specific link using statement array
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

    for (let i = 0; i < localStatements.length; i++) {
        let objectType = localStatements[i].objectType;
        if (localStatements[i].hasOwnProperty("properties")) { //Only links have properties so source and target is set after this check
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
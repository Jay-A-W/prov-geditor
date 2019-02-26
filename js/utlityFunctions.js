function setPrefixInDoc() {

}

function getProvAsJSON(doc) {
    return doc.scope.getProvJSON();
}
function insensitiveStringCompare(string1, string2) {
    return typeof string1 === 'string' && typeof string2 === 'string'
        ? string1.localeCompare(string2, undefined, { sensitivity: 'accent' }) === 0
        : string1 === string2;
}

function editPROVElement(type, currentName, newName, prefix) {

    let provElement = doc.scope.statements.filter(elementType => elementType.constructor.name == type).filter(element => element.identifier.localPart == currentName);
    if (provElement.length != 0) {

        let prevName = provElement[0].identifier.localPart;
        provElement[0].identifier.localPart = newName;
        provElement[0].identifier.uri = provElement[0].identifier.uri.replace(prevName, newName);

    } else {
        let justType = type.replace("custom.", "")
        switch (justType) {
        
            case 'Entity':
                item = new joint.shapes.custom.Entity();
                item.attr('label/text', newName);
                item.attr('prefix', prefix);
                let entity = doc.entity(prefix + ":" + newName);
                break;

            case 'Activity':
                item = new joint.shapes.custom.Activity();
                item.attr('label/text', newName);
                item.attr('prefix', prefix);
                let activity = doc.activity(prefix + ":" + newName);
                break;

            case 'Agent':
                item = new joint.shapes.custom.Agent();
                item.attr('label/text', newName);
                item.attr('prefix', prefix);
                let agent = doc.agent(prefix + ":" + newName);
                break;
            default:
                throw new Error('Invalid item type');
        }
    }
};
var api = new $.provStoreApi({ username: "username", key: "api_key" });

function show_doc_json(doc) {
    console.log(doc);
    console.log("PROV-JSON export of the above document:")
    var provjson = doc.getProvJSON();
    console.log(provjson);
    console.log(JSON.stringify(provjson, null, "  "));
}

function loadFromProvStore(storeID) {
    var doc;
    api.getDocumentBody(storeID, "json",
        function (response) {
            console.log(response);
        },
        function (error) {
            console.log(error);
        }
    );
}
function submitToProvStore(doc) {
    var provjson = doc.getProvJSON();
    api.submitDocument("primer-test", provjson, true,
        function (new_document_id) {
            loadFromProvStore((new_document_id));
        },
        function (error) {
            console.error(error);
        }
    );
}
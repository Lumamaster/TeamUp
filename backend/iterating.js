/* Iterates through the list, changing the BSON
   objects to text and printing to console */
exports.iterateFunc = function(doc) {
    console.log(JSON.stringify(doc, null, 4));
}

/* Catches and prints any errors that occur
   when iterating through the list of BSON objects */
exports.errorFunc = function(error) {
    if (error != null) {
        console.log(error);
    }
}
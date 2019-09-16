/* Iterates through the list, changing the BSON
   objects to text and printing to console */
   function iterateFunc(doc) {
    console.log(JSON.stringify(doc, null, 4));
}
 
/* Catches and prints any errors that occur
   when iterating through the list of BSON objects */
function errorFunc(error) {
    if (error != null) {
        console.log(error);
    }
}
const categoryschema = require('./schema/category.schems')
/* Add new Category Data*/
const saveCategory = (data) => {
    try {

        return new Promise((resolve, reject) => {
            categoryschema.create(data, function (err, result) {
                if (err) reject(err)
                // saved!
                resolve(result)
            });

        })
    }
    catch (err) {
        console.log(err)
    }

}
const getCategory = (callback, object = {}, isFilter = false) => {
    console.log("getCategory +++++")
    if (isFilter)
        categoryschema.find(object, {}, callback);
    else
        categoryschema.find({}, callback);
}

module.exports = { saveCategory, getCategory }
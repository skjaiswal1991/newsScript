const categorymodel = require('./../model/category.model')

const addNewCategory = async (data, callback) => {
    try {


        let categorySlug = data.categorytitle.replace(/\s+/g, '-').toLowerCase()
        getCategoryByslug(categorySlug, async (err, result) => {
            if (err) console.log(err)
            if (result.length < 1) {
                catData = {
                    categoryTitle: data.categorytitle,
                    categorySlug: data.categorytitle.replace(/\s+/g, '-').toLowerCase(),
                    categoryCreated_at: new Date(),
                    categoryPublish_at: new Date(),
                }
                const responseData = await categorymodel.saveCategory(catData)
                console.log("addNewCategory", responseData);
                return responseData;
            } else {

                callback(err, result)
            }
        })
    } catch (err) {
        return err
    }

}

const getCategoryDate = (callback) => {
    categorymodel.getCategory(callback);
}

const getCategoryByslug = (categorySlug, callback) => {
    categorymodel.getCategory(callback, { categorySlug: categorySlug }, true)
}

const getCategoryData = (callback) => {
    categorymodel.getCategory(callback)
}


module.exports = { addNewCategory, getCategoryDate, getCategoryByslug, getCategoryData }
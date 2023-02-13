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

const getCategoryList = (req, res) => {
    try {
        console.log("getCategoryList+++")
        categorymodel.getCategory((error, result) => {
            if (error) res.status(400).send(err)
            res.status(200).send(result);
        })
    } catch (error) {
        if (err) res.status(400).send(error)
    }

}


module.exports = { addNewCategory, getCategoryDate, getCategoryList, getCategoryByslug }
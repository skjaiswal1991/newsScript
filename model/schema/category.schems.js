const mongoose = require('mongoose')
const category = new mongoose.Schema({

    categoryTitle: {
        require: true,
        type: String
    },
    categorySlug: {
        require: true,
        type: String
    },
    categoryDescription: {
        require: false,
        type: String
    },
    categoryImage: {
        type: String
    },

    categoryMetaTitle: {
        require: false,
        type: String
    },
    categoryMetaDescription: {
        require: false,
        type: String
    },
    categoryMetaKeyword: {
        require: false,
        type: String
    },
    categoryPublish_at: {
        require: false,
        type: Date
    },
    categoryCreated_at: {
        require: false,
        type: Date
    }

})

const schemModel = mongoose.model("categorys", category);

module.exports = schemModel;




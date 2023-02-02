const mongoose = require('mongoose')
const posts = new mongoose.Schema({

    title: {
        require: true,
        type: String
    },
    description: {
        require: true,
        type: String
    },
    postslug: {
        require: true,
        type: String
    },
    publishname: {
        require: true,
        type: String
    },
    image: {
        type: String
    },
    categoryID: {
        require: true,
        type: mongoose.Schema.Types.ObjectId
    },
    sourceUrl: {
        require: true,
        type: String
    },
    metatitle: {
        require: true,
        type: String
    },
    metadescription: {
        require: true,
        type: String
    },
    metakeyword: {
        require: true,
        type: String
    },
    publishDate: {
        require: false,
        type: Date
    },
    created_at: {
        require: false,
        type: Date
    }

})

const schemModel = mongoose.model("posts", posts);



module.exports = schemModel;




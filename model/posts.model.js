const postschema = require('./schema/posts.schems')
const savePost = (data, callback) => {
    try {
        postschema.create(data, callback)
    }
    catch (err) {
        console.log(err)
    }

}
const getPost = (callback, object = {}, option = false, filter = {}, skip = 0, limit = 0) => {
    if (option) {
        postschema.find(object, filter, callback).skip(skip).limit(limit).sort('-publishDate');
    } else {
        postschema.find({}, callback).sort('-publishDate');
    }
}




const aggregateData = (callback) => {
    postschema.aggregate([
        {
            $lookup:
            {
                from: 'categorys',
                localField: 'categoryID',
                foreignField: '_id',
                as: 'category'
            }
        }
    ]).sort('-publishDate').exec(callback);

}


module.exports = { savePost, getPost, aggregateData }
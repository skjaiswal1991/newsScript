var path = require('path')
var gtts = require('node-gtts')('hi');
const postmodel = require('./../model/posts.model')

const addNewPosts = (data, callback) => {

    // console.log("data", data.rss.channel[0].item);

    var Obj = {
        bhaskarhindi: '',
        'dainik bhaskar': '',
        'Dainik Bhaskar': '',
        'dainik': '',
        bhaskar: '',
        'bhaskarhindi.com': '',
        'दैनिक भास्कर': '',
        'undefined': '',

    }

    const {
        postslug, publishname, publishDate, categoryID, pageurl, title, image, description, metakeyword, metadescription, metatitle
    } = data;
    // console.log(d.image)
    // if (i < 1) {
    console.log(postslug, "postslug");
    postmodel.getPost((err, result) => {
        // console.log("result", result);
        if (err) new ErrorEvent(err)
        if (result.length < 1) {
            postData = {
                title: title && title.replace(/bhaskarhindi|Dainik|Bhaskar|दैनिक भास्कर/gi, function (matched) { return Obj[matched] }).replace(/<[^>]*>?/gm, ''),
                description: description && description.replace(/bhaskarhindi|Dainik|Bhaskar|दैनिक भास्कर/gi, function (matched) { return Obj[matched] }).replace(/<[^>]*>?/gm, ''),
                image,
                categoryID,
                postslug,
                publishname,
                publishDate,
                sourceUrl: pageurl,
                metakeyword: metakeyword.replace(/bhaskarhindi|dainik bhaskar|dainik|bhaskar|Dainik Bhaskar|bhaskarhindi.com|दैनिक भास्कर|undefined/gi, function (matched) { return Obj[matched] == 'undefind' ? '' : Obj[matched] }),
                metadescription: metadescription.replace(/bhaskarhindi|dainik bhaskar|dainik|bhaskar|Dainik Bhaskar|bhaskarhindi.com|दैनिक भास्कर|undefined/gi, function (matched) { return Obj[matched] }),
                metatitle: metatitle.replace(/bhaskarhindi|dainik bhaskar|dainik|bhaskar|bhaskarhindi.com|Dainik Bhaskar|दैनिक भास्कर|undefined/gi, function (matched) { return Obj[matched] }),
                created_at: new Date()
            }
            postmodel.savePost(postData, callback)
        } else {
            callback(err, { msg: "Already exist" })
        }
    }, { postslug }, true)


}


const getPostData = (req, res) => {
    postmodel.aggregateData((err, result) => {
        if (err) res.status(400).send(err)
        res.status(200).send(result)
    })
}

const getPostByCategory = (callback, categoryId) => {
    postmodel.getPost(callback, {});
}
const getAllPostTitle = async (req, res) => {
    postmodel.getPost((err, result) => {
        if (err) res.status(400).send(err)
        res.status(200).send(result)
    }, {}, true, { title: 1, postslug: 1 }, 0, 10)

}

const getPostByslug = async (req, res) => {

    const postslug = req.body.postslug;
    console.log(postslug)

    postmodel.getPost((err, result) => {
        if (err) res.status(400).send({ 'msg': err })

        // var filepath = path.join(appRoot + '/audio', `${result && result[0].postslug}.mp3`);
        // gtts.save(filepath, result && result[0].description, function (err, data) {
        //     console.log('save done', data, err);
        // })
        res.status(200).send(result)
    }, { postslug }, true)
}

const getPost = (req, res) => {
    try {


        // console.log("req.params.slug", req.body.postslug)
        // postmodel.getPost((err, data) => {
        //     if (err) res.status(400).send(err)
        //     if (data && data.length > 0) {
        //         categoymodel.getCategory((error, result) => {
        //             if (error) res.status(400).send(error)
        //             res.status(200).send({ category: result[0], post: data[0] })
        //         }, { _id: data[0].categoryId })
        //     } else {
        //         res.status(400).send({ msg: "Post not Found" })
        //     }
        //     // res.status(200).send(data)
        // }, { postslug: req.params.slug }, true)
    } catch (err) {
        res.status(400).send(err)
    }


}

const getPostDescription = (postslug, callback) => {
    postmodel.getPost(callback, { postslug }, true, { description: 1, postslug: 1 })

}

module.exports = { addNewPosts, getPostData, getPostByslug, getPostDescription, getPost, getAllPostTitle }
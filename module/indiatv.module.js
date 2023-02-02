
var https = require('https');
var parseString = require('xml2js').parseString;
var xml = '';

function xmlToJson(url, callback) {
    var req = https.get(url, function (res) {
        var xml = '';

        res.on('data', function (chunk) {
            xml += chunk;
        });

        res.on('error', function (e) {
            callback(e, null);
        });

        res.on('timeout', function (e) {
            callback(e, null);
        });

        res.on('end', function () {
            parseString(xml, function (err, result) {
                callback(null, result);
            });
        });
    });
}

var url = "https://www.indiatv.in/rssnews/topstory.xml"

xmlToJson(url, function (err, data) {
    if (err) {
        // Handle this however you like
        return console.err(err);
    }
    console.log("I am here");

    // Do whatever you want with the data here
    // Following just pretty-prints the object
    console.log(JSON.stringify(data, null, 2));
});



// const filterData = (url, callback) => {

//     // console.log("data", data.rss.channel[0].item);

//     var Obj = {
//         bhaskarhindi: '',
//         'dainik bhaskar': '',
//         'Dainik Bhaskar': '',
//         'dainik': '',
//         bhaskar: '',
//         'bhaskarhindi.com': '',
//         'दैनिक भास्कर': '',
//         'undefined': '',

//     }

//     const {
//         postslug, publishname, publishDate, categoryID, pageurl, title, image, description, metakeyword, metadescription, metatitle
//     } = data;
//     // console.log(d.image)
//     // if (i < 1) {
//     console.log(postslug, "postslug");
//     postmodel.getPost((err, result) => {
//         // console.log("result", result);
//         if (err) new ErrorEvent(err)
//         if (result.length < 1) {
//             postData = {
//                 title: title && title.replace(/bhaskarhindi|Dainik|Bhaskar|दैनिक भास्कर/gi, function (matched) { return Obj[matched] }).replace(/<[^>]*>?/gm, ''),
//                 description: description && description.replace(/bhaskarhindi|Dainik|Bhaskar|दैनिक भास्कर/gi, function (matched) { return Obj[matched] }).replace(/<[^>]*>?/gm, ''),
//                 image,
//                 categoryID,
//                 postslug,
//                 publishname,
//                 publishDate,
//                 sourceUrl: pageurl,
//                 metakeyword: metakeyword.replace(/bhaskarhindi|dainik bhaskar|dainik|bhaskar|Dainik Bhaskar|bhaskarhindi.com|दैनिक भास्कर|undefined/gi, function (matched) { return Obj[matched] == 'undefind' ? '' : Obj[matched] }),
//                 metadescription: metadescription.replace(/bhaskarhindi|dainik bhaskar|dainik|bhaskar|Dainik Bhaskar|bhaskarhindi.com|दैनिक भास्कर|undefined/gi, function (matched) { return Obj[matched] }),
//                 metatitle: metatitle.replace(/bhaskarhindi|dainik bhaskar|dainik|bhaskar|bhaskarhindi.com|Dainik Bhaskar|दैनिक भास्कर|undefined/gi, function (matched) { return Obj[matched] }),
//                 created_at: new Date()
//             }
//             postmodel.savePost(postData, callback)
//         } else {
//             callback(err, { msg: "Already exist" })
//         }
//     }, { postslug }, true)


// }



// // module.exports = { addNewPosts, getPostData, getPostByslug, getPost, getAllPostTitle }
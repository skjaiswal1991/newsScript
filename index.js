var https = require('https');
var cors = require('cors');
var gtts = require('node-gtts')('hi');
const fs = require('fs')
var parseString = require('xml2js').parseString;
require('dotenv').config()
var path = require('path');
const express = require('express')
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./db/db')
const app = new express()
global.appRoot = path.resolve(__dirname);
const postModule = require('./module/posts.module')
const categoyModule = require('./module/categorys.module')


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

app.use(cors());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use('/uploads', express.static(process.cwd() + '/audio'))


app.get('/speech', (req, res) => {
    // var filepath = path.join(appRoot + '/audio', `${result && result[0].postslug}.mp3`);
    // gtts.save(filepath, result && result[0].description, function (err, data) {
    //     console.log('save done', data, err);
    // })
})

app.get('/playaudio/:slug', function (req, res) {
    console.log("req", req)
    try {
        console.log("playaudio");
        if (req.params && req.params.slug) {
            var filepath = path.join(appRoot + '/audio', `${req.params.slug}.mp3`);
            // console.log("filepath++", filepath);
            // console.log(fs.existsSync(filepath));
            postModule.getPostDescription(req.params.slug, (err, data) => {

                if (err) throw new Error(err);
                console.log("descriptui", data)
                if (data && data[0] && data[0].description) {
                    let desc = data[0].description.replace(/\n/gi, ``);
                    res.set({ 'Content-Type': 'audio/mpeg' });

                    gtts.stream(desc).pipe(res);
                }

            })

        }

    } catch (err) {
        res.status(400).send(err)
    }


})

app.post('/playaudio', function (req, res) {
    console.log(req.body.slug)
    try {
        console.log("playaudio");
        if (req.body && req.body.slug) {
            var filepath = path.join(appRoot + '/audio', `${req.body.slug}.mp3`);
            console.log("filepath++", filepath);
            console.log(fs.existsSync(filepath));
            // if (!fs.existsSync(filepath)) {
            postModule.getPostDescription(req.body.slug, async (err, data) => {
                if (err) throw new Error(err);
                console.log("descriptui", data)
                if (data && data[0] && data[0].description) {
                    let desc = data[0].description.replace(/\n/gi, ``);
                    await gtts.save(filepath, desc, function (err, data) {
                        if (err) res.status(400).send(err)
                        res.status(200).send(data)

                    })
                }

            })
            // } else {
            //     res.status(200).send(filepath)
            // }
        }

    } catch (err) {
        res.status(400).send(err)
    }


})
var xml = '';

// function xmlToJson(url, callback) {
//     console.log("url", url)
//     var req = https.get(url, function (res) {
//         var xml = '';

//         res.on('data', function (chunk) {
//             xml += chunk;
//         });

//         res.on('error', function (e) {
//             callback(e, null);
//         });

//         res.on('timeout', function (e) {
//             callback(e, null);
//         });

//         res.on('end', function () {
//             parseString(xml, function (err, result) {
//                 // console.log(err)

//                 callback(null, result);
//             });
//         });
//     });
// }

// var url = "https://hindi.news18.com/rss/khabar/sports/others.xml"

// xmlToJson(url, function (err, data) {
//     if (err) {
//         // Handle this however you like
//         return console.err(err);
//     }
//     // console.log("I am here", data);

//     // Do whatever you want with the data here
//     // Following just pretty-prints the object
//     // console.log(JSON.stringify(data, null, 2));
//     console.log(data.rss.channel[0].item[0])
//     categoyModule.getCategoryByslug('cricket', async (err, result) => {
//         if (err) return err
//         let categoryID = result[0]._id.toString();
//         try {
//             let addNews = []
//             // console.log(data.length)
//             // data.map(async (n, i) => {
//             //     console.log(n, "url")
//             // let status = await getNewsFilterForNews18(data.rss.channel[0].item[0].link[0], 'news18 Hindi', new Date(), categoryID)
//             // console.log(status);

//             // })
//             // res.status(200).send(addNews)
//         } catch (err) {
//             // res.status(400).send(err)
//         }
//     })


// });


/*
*
*/



const Refinedesc = (data) => {
    const $ = cheerio.load(data);

    let ndata = $('ele-const-widget').remove()
    return ndata;
}


const getNewsFilterForNews18 = (detailUrl, publishname, publishDate, categoryID) => {
    console.log("getNewsFilter++++");
    // const detailUrl = "https://www.bhaskarhindi.com/international/news/taliban-government-to-sign-first-agreement-with-chinese-firm-for-oil-drill-443297";
    return new Promise((resolve, reject) => {
        axios(detailUrl).then((response) => {
            const html_data = response.data;
            const $ = cheerio.load(html_data);
            let url = detailUrl.split('/').slice(-1).pop()
            let slug = url.split('-');
            slug.splice(slug.length - 1, 1)
            const postslug = slug.join('-')
            const pageurl = detailUrl
            const title = $('h1').text()
            const image = $('.artcl_contents_img img').attr("src")
            const description = $('.khbr_rght_sec').text()


            const metatitle = slug.join(' ')
            const metakeyword = $('meta[name="keywords"]').attr('content')
            const metadescription = $('meta[name="description"]').attr('content')
            // const refinedescription = Refinedesc(description)
            // console.log("refinedescription", refinedescription)
            const data = {
                postslug, publishname, publishDate, categoryID, pageurl, title, image, description, metakeyword, metadescription, metatitle
            }
            postModule.addNewPosts(data, (err, response) => {
                if (err) reject(err)
                resolve(response)
            })
        })
    });
}

const getNewsFilter = (detailUrl, publishname, publishDate, categoryID) => {
    console.log("getNewsFilter++++");
    // const detailUrl = "https://www.bhaskarhindi.com/international/news/taliban-government-to-sign-first-agreement-with-chinese-firm-for-oil-drill-443297";
    return new Promise((resolve, reject) => {
        axios(detailUrl).then((response) => {
            const html_data = response.data;
            const $ = cheerio.load(html_data);
            let url = detailUrl.split('/').slice(-1).pop()
            let slug = url.split('-');
            slug.splice(slug.length - 1, 1)
            const postslug = slug.join('-')
            const pageurl = detailUrl
            const title = $('.single-head h1.title').text()
            const image = $('.featured img').attr("src")
            let desc = $('.description').first().text().replace('आईएएनएस', '').replace('डिस्क्लेमरः यह आईएएनएस न्यूज फीड से सीधे पब्लिश हुई खबर है. इसके साथ bhaskarhindi.com की टीम ने किसी तरह की कोई एडिटिंग नहीं की है. ऐसे में संबंधित खबर को लेकर कोई भी जिम्मेदारी न्यूज एजेंसी की ही होगी.', '')
            const description = desc
            const metatitle = slug.join(' ')
            const metakeyword = $('meta[name="keywords"]').attr('content')
            const metadescription = $('meta[name="description"]').attr('content')
            const data = {
                postslug, publishname, publishDate, categoryID, pageurl, title, image, description, metakeyword, metadescription, metatitle
            }
            postModule.addNewPosts(data, (err, response) => {
                if (err) reject(err)
                resolve(response)
            })
        })
    });
}

app.get('/audio', (req, res) => {

    res.send({ data: './Voice.mp3' })
})

app.get("/posts", postModule.getPostData)

app.post("/category", (req, res) => {

    console.log(req.body);
    categoyModule.addNewCategory(req.body, (err, result) => {
        res.status(200).send(result.length > 0 && { msg: 'CATEGORY ALREADY EXIST' })
    })

})

app.post("/posts", postModule.getPostByslug);
app.get("/allposttitle", postModule.getAllPostTitle);

app.post("/addnews", (req, res) => {

    try {


        function xmlToJson(url, callback) {

            axios(url).then((response) => {
                const html_data = response.data;
                const $ = cheerio.load(html_data);
                let data = $('.text-dark');
                let newsUrl = [];
                [...data].map((el, i) => i > 0 && newsUrl.push($(el).attr('href')))
                callback('', newsUrl)
            })
        }


        var url = req.body.newsUrl;

        xmlToJson(url, function (err, data) {
            if (err) {
                // Handle this however you like
                return console.err(err);
            }
            console.log(data);


            categoyModule.getCategoryByslug(req.body.categoryslug, (err, result) => {
                if (err) return err
                let categoryID = result[0]._id.toString();
                try {
                    let addNews = []
                    console.log(data.length)
                    data.map(async (n, i) => {

                        let status = await getNewsFilter(req.body.baseUrl + n, req.body.publisher, new Date(), categoryID)
                        console.log(status);


                    })
                    res.status(200).send(addNews)
                } catch (err) {
                    res.status(400).send(err)
                }
            })




        });

    } catch (err) {
        res.status(400).send(err)
    }

})
app.listen(process.env.PORT_NUMBER, () => {
    console.log("port is running ", process.env.PORT_NUMBER)
})





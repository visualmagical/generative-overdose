var path = require('path');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
var https = require('https');

const app = express();
const port = process.env.PORT || 5000;

const favourites = require("./favs.json");
const news = require("./news.json");

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.post('/api/add', (req, res) => {
    res.send(
        `add this item: ${req.body.fav.display_url}`,
    );

    if (req.body.fav.shortcode) {
        favourites.nodes.push(req.body.fav);

        function saveImageToDisk(url, localPath) {
            var file = fs.createWriteStream(localPath);
            var request = https.get(url, function(response) {
                response.pipe(file);
            });
        }

        saveImageToDisk(req.body.fav.display_url, `./fav-images/${req.body.fav.shortcode}.jpg`)

        fs.writeFile(`./favs.json`, JSON.stringify(favourites), err => {
            if (err) throw err;
            console.log("Done writing");
        });
    }
});

app.post('/api/remove-fav', (req, res) => {
    let filteredFavs;

    if (req.body.fav && req.body.fav.shortcode) {
        const filteredFavsAry = favourites.nodes.filter(item => {
            return item.shortcode !== req.body.fav.shortcode;
        })
        filteredFavs = { nodes: filteredFavsAry }
    };

    fs.writeFile(`./favs.json`, JSON.stringify(filteredFavs), err => {
        if (err) throw err;
        console.log("Done writing"); // Success
        res.send(filteredFavs);
    });
})

app.get('/api/get-favs', (req, res) => {
    res.send(favourites)
})

app.post('/api/fav-images', (req, res) => {
    // const img = require(`./fav-images/${req.body}.jpg`);
    // res.send(img);

    var file = path.join(__dirname, `fav-images/${req.body.shortcode}.jpg`);
    var s = fs.createReadStream(file);

    s.on('open', function () {
        res.set('Content-Type', 'image/jpeg');
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'image/jpeg');
        res.status(404).end('Not found');
    });
})

app.post('/api/save-news', (req, res) => {
    fs.writeFile(`./news.json`, JSON.stringify(req.body.news), err => {
        if (err) throw err;
        console.log("Done writing"); // Success
        res.send('News saved');
    });
})

app.get('/api/get-news', (req, res) => {
    res.send(news)
})


app.listen(port, () => console.log(`Listening on port ${port}`));
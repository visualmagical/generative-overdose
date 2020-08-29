var path = require('path');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
var https = require('https');

const app = express();
const port = process.env.PORT || 5000;

const favourites = require("./favs.json");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/add', (req, res) => {
    res.send(
        `add this item: ${req.body.fav.display_url}`,
    );

    if (req.body.fav.shortcode) {
        favourites.nodes.push(req.body.fav);
        console.log('fav: ', req.body.fav.display_url);

        function saveImageToDisk(url, localPath) {
            // var fullUrl = url;
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
        // Checking for errors
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
    console.log('FILE', file)
    var s = fs.createReadStream(file);

    s.on('open', function () {
        res.set('Content-Type', 'image/jpeg');
        s.pipe(res);
        console.log(res)
    });
    s.on('error', function () {
        res.set('Content-Type', 'image/jpeg');
        res.status(404).end('Not found');
    });
})
app.listen(port, () => console.log(`Listening on port ${port}`));
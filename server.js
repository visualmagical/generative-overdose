const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

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

        fs.writeFile(`./favs.json`, JSON.stringify(favourites), err => {
            // Checking for errors
            if (err) throw err;
            console.log("Done writing"); // Success
        });
    }
});

app.post('/api/remove-fav', (req, res) => {
    let filteredFavs;

    // console.log('req.body.fav: ', req.body.fav)
    if (req.body.fav && req.body.fav.shortcode) {
        const filteredFavsAry = favourites.nodes.filter(item => {
            console.log(item.shortcode, req.body.fav.shortcode)
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

app.listen(port, () => console.log(`Listening on port ${port}`));
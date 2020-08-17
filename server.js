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
        `I received your POST request. This is what you sent me: ${req.body.fav.display_url}`,
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

app.get('/api/get-favs', (req, res) => {
    res.send(favourites)
})

app.listen(port, () => console.log(`Listening on port ${port}`));
const express = require('express');
const hbs = require('hbs');
const fs = require('fs')
var app = express();

const port = process.env.PORT || 8080;

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');


app.get("/", (request, response) => {
    response.render('index.hbs');
});


app.listen(port, () => {
    console.log('Server is up on the port 8080');
});
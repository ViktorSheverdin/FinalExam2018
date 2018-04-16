const express = require('express');
const hbs = require('hbs');
const request = require('request');
const bodyParser = require('body-parser');
const fs = require('fs')
var app = express();

const port = process.env.PORT || 8080;

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.get("/", (request, response) => {
    response.render('weather_api.hbs');
});
place = ""
app.post('/myaction', function(req, res) {
  res.send('Request '+req.body.w_place);
  place=req.body.w_place
});

var geocode = (address) => {
    return new Promise((resolve, reject) => {
	    	request ({
			url: "http://maps.googleapis.com/maps/api/geocode/json?address="+ encodeURIComponent(address),
			json: true
		}, (error, response, body) => {
			if (error){
				reject('Cannot cannect to Google Maps');
				//console.log('Cannot cannect to Google Maps');
			}
			else if (body.status === 'ZERO_RESULTS'){
				reject('Cannot find request address');
				//console.log('Cannot find request address');
			}
			else if(body.status === 'OK'){
				resolve({
					address: body.results[0].formatted_address,
					lat: body.results[0].geometry.location.lat,
					lng: body.results[0].geometry.location.lng,
					type: body.results[0].types[0]
				});
				// console.log(`Your request venue: ${address}`);
				// console.log(`Address: ${body.results[0].formatted_address}`);
				// console.log(`Type: ${body.results[0].types[0]}`);
			}
		});
    });
};

var weather = (lat,lng) => {
	return new Promise((resolve, reject) => {
			request({
		url: `https://api.darksky.net/forecast/0edcf0f0039936e1fdbf3a5ef13543ef/${lat},${lng}`,
		json: true
	},(error, response, body) => {
		if (error){
			reject('Cannot cannect');
		}
		else if (body.code==400){
			reject("The given location is invalid.");
		}
		else {			
			resolve({
				temp: body.currently.temperature,
				humidity: body.currently.humidity,
				precipType: body.currently.precipType
				
			});
		}
		});
	})
}
app.get('/w',(request,response) => {
		geocode(place).then((result) => {
	    return weather(result.lat,result.lng)
	}, (errorMessage) => {
	    console.log(errorMessage);
	}).then((results) => {
		if(results.precipType!=undefined){
			response.send(`The temperature in ${place} is ${results.temp} and is ${results.precipType}`);
		}
		else{
			response.send(`The temperature in ${place} is ${results.temp} and is sunny`);			
		}
	}).catch((errorMessage) => {
		response.send("Error",errorMessage);
	})
});



app.listen(port, () => {
    console.log('Server is up on the port 8080');
});
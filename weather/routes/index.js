const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
require('dotenv').config();
const OWM_API_KEY = process.env.OWM_API_KEY || 'invalid_key';
const UNITS = process.env.UNITS || 'metric';

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { weather: null, err: null });
});

router.post('/get_weather', async function (req, res) {
  //req.body.city = 'iasi'
  const city = req.body.city || 'iasi';
  const urlTemp = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${UNITS}&appid=${OWM_API_KEY}`;
  console.log('Call URL temp:', urlTemp)
  
  try {
    let dataTemp = await fetch(urlTemp);
    let weatherTemp = await dataTemp.json();

    const lat = weatherTemp.coord.lat
    const lon = weatherTemp.coord.lon
    const urlPollution = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}`
    console.log('Call URL pollution', urlPollution)
    let dataPollution = await fetch(urlPollution);
    let weatherPollution = await dataPollution.json();
    weatherTemp.pollutionData = weatherPollution.list[0].components

    renderResult(res, weatherTemp, 'index')
  }
  catch (err) {
    console.log(err);
    res.render('index', {weather: null, error: 'Error: Unable to invoke OpenWeatherMap API'});
  }

});

function renderResult(res, weather1, indexPage) {
  console.log(weather1);
  if(weather1.cod == '404' && weather1.main == undefined) {
    res.render(indexPage, {weather: null, error: 'Error: Unknown city'});
  }
  else if (weather1.cod == '401' && weather1.main == undefined) {
    res.render(indexPage, {weather: null, error: 'Error: Invalid API Key. Please see http://openweathermap.org/faq#error401 for more info.'});
  }
  else {
    let unit_hex = (UNITS == 'imperial') ? '&#8457' : '&#8451';
    res.render(indexPage, {weather: weather1, error: null, units: unit_hex, indexPage: indexPage});
  }
}

module.exports = router;

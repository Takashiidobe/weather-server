const express = require("express");
const axios = require("axios").default;
const app = express();

const kelvinToFahrenheit = (kelvin) => Math.round((kelvin - 273.15) * 1.8 + 32);
const URL = "https://api.openweathermap.org/data/2.5/weather";
const IP_URL = "http://ip-api.com/json";
const APP_ID = process.env.APP_ID;

app.set("trust proxy", true);

app.get("/", async (req, res) => {
  try {
    const ipUrl = `${IP_URL}/${req.ip}`;
    const resp = await axios.get(ipUrl);
    try {
      const { city, country } = resp.data;
      const weatherResponse = await axios.get(
        `${URL}?q=${city},${country}&appid=${APP_ID}`
      );
      const { temp, feels_like, temp_min, temp_max } =
        weatherResponse.data.main;

      res.json({
        city,
        country,
        temp: kelvinToFahrenheit(temp),
        feels_like: kelvinToFahrenheit(feels_like),
        temp_min: kelvinToFahrenheit(temp_min),
        temp_max: kelvinToFahrenheit(temp_max),
      });
    } catch (err) {
      res.send(err.message);
    }
  } catch (err) {
    res.send(err.message);
  }
});

app.listen(3000, () => console.log("running"));

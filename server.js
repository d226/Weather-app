const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;
const weatherApiKey = process.env.WEATHER_API_KEY;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
const pathName = path.join(__dirname, "./public");
app.use(express.static(pathName));

// Routes
app.get("/", (req, res) => {
  res.render("index", { weatherData: null });
});

app.get("/weather", async (req, res) => {
  const cityName = req.query.city;

  if (!cityName) {
    return res.render("index", {
      weatherData: null,
      error: "Please enter a city name.",
    });
  }

  try {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${cityName}&days=4&aqi=no&alerts=no`;

    const response = await axios.get(apiUrl);
    const weatherData = {
      city: response.data.location.name,
      dateAndTime: response.data.location.localtime,
      forecast: response.data.current.condition.text,
      icon: response.data.current.condition.icon,
      temp: response.data.current.temp_c,
      realFeel: response.data.current.feelslike_c,
      humidity: response.data.current.humidity,
      wind: response.data.current.wind_mph,
      pressure: response.data.current.pressure_in,
    };

    res.render("index", { weatherData, error: null });
  } catch (error) {
    res.render("index", {
      weatherData: null,
      error: "City not found. Please try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

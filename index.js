const express = require("express");
const dotenv = require("dotenv");
const { getLocationDetails, getTemperature } = require("./helper_functions");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("HNGi11: Stage 1 Task - Farhan S.");
});

app.get("/api/hello", async (req, res) => {
  const name = req.query.visitor_name || "User";
  const client_ip = req.ip.includes('::ffff:') ? req.ip.split('::ffff:')[1] : req.ip;

  // Get the location
  const response = await getLocationDetails();
  if (response.error) {
    return res.status(500).json({
      message: response.message,
      data: {},
    });
  }
  const { lat, lon, city } = response.data;

  // Get the temperature of city
  const weatherResponse = await getTemperature(lat, lon);
  if (weatherResponse.error) {
    return res.status(500).json({
      message: weatherResponse.message,
      data: {},
    });
  }

  const temperature = weatherResponse.data;

  return res.json({
    client_ip: client_ip,
    location: city,
    greeting: `Hello, ${name}!, the temperature is ${temperature} degrees Celcius in ${city}`,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

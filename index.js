const express = require("express");
const dotenv = require("dotenv");
const { getLocationDetails, getTemperature } = require("./helper_functions");

var Address6 = require("ip-address").Address6;

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("HNGi11: Stage 1 Task - Farhan S.");
});

app.get("/api/hello", async (req, res) => {
  try {
    const name = req.query.visitor_name || "User";
    const client_ip = req.ip;
    var address = new Address6(client_ip);
    var teredo = address.inspectTeredo();

    // Get the location
    const response = await getLocationDetails(teredo.client4);
    if (response.error) {
      return res.status(500).json({
        message: response.message,
        data: {},
      });
    }

    if (!response.data.city) {
      return res.status(500).json({
        message: "Error: No location details found",
        data: response.data,
      });
    }
    const { loc, city } = response.data;

    // Get the temperature of city
    const [lat, lon] = loc.split(",");
    const weatherResponse = await getTemperature(lat, lon);
    if (weatherResponse.error) {
      return res.status(500).json({
        message: weatherResponse.message,
        data: {},
      });
    }

    const temperature = weatherResponse.data;

    return res.json({
      client_ip: teredo.client4,
      location: city,
      greeting: `Hello, ${name}!, the temperature is ${temperature} degrees Celcius in ${city}`,
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      message: "Internal Server Error: " + error.message,
      data: {},
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

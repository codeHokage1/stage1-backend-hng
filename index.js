const express = require("express");
const dotenv = require("dotenv");
const {
  getLocationDetails,
  getTemperature,
  isPrivateIp,
} = require("./helper_functions");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("HNGi11: Stage 1 Task - Farhan S.");
});

app.get("/api/hello", async (req, res) => {
  try {
    const name = req.query.visitor_name || "User";

    // Get client IP address
    let clientIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    clientIp = clientIp.replace("::ffff:", ""); // Remove '::ffff:' from IPv6-mapped IPv4 address
    clientIp = clientIp.split(",")[0]; // Get the first IP address if there are multiple

    console.log("Client IP: ", clientIp);

    // Check if the IP address is private
    if (isPrivateIp(clientIp)) {
      return res.json({
        client_ip: clientIp,
        location: "Local Network",
        greeting: `Hello, ${name}! You are accessing from a local network.`,
      });
    }

    // Get the location
    const response = await getLocationDetails(clientIp);
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
      client_ip: clientIp,
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

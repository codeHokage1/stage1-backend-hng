const axios = require("axios");
const dotenv = require("dotenv");
const IPinfoWrapper = require("node-ipinfo").IPinfoWrapper;

dotenv.config();

const token = process.env.IPINFO_TOKEN || "";

const ipinfoWrapper = new IPinfoWrapper(token);

exports.getLocationDetails = async (ip) => {
  try {
    const locationResponse = await axios.get(
      `https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`
    );
    console.log("locationResponse: ", locationResponse.data);
    const locationData = locationResponse.data;
    if (!locationData) {
      return {
        error: true,
        message: "Error: No location details found",
        data: null,
      };
    }
    return {
      error: false,
      message: "Success: Location details found",
      data: locationData,
    };
  } catch (error) {
    return {
      error: true,
      message: error.message,
      data: null,
    };
  }
};

exports.getTemperature = async (lat, long) => {
  try {
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    if (!weatherResponse) {
      return {
        error: true,
        message: "Error: No weather details found",
        data: null,
      };
    }

    const temperature = weatherResponse.data.main.temp;
    return {
      error: false,
      message: "Success: Weather details found",
      data: temperature,
    };
  } catch (error) {
    return {
      error: true,
      message: error,
      data: null,
    };
  }
};

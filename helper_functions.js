const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const token = process.env.IPINFO_TOKEN || "";
exports.getLocationDetails = async (ip) => {
  try {
    // const locationResponse = await axios.get(
    //   `https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`
    // );
    // const locationData = locationResponse.data;
    // console.log("Location Response 1: ", locationData)

    const lcoationResponse2 = await axios.get(`http://ip-api.com/json/${ip}`);
    const locationData = lcoationResponse2.data;
    console.log("Location Response 2: ", lcoationResponse2.data);
    
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

exports.isPrivateIp = (ip) => {
  return /^(127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[01])\.\d+\.\d+)$/.test(ip);
}

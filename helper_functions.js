import axios from "axios";
import dotenv from "dotenv";
import {IPinfoWrapper} from "node-ipinfo";

dotenv.config();

const token = process.env.IPINFO_TOKEN || "";

const ipinfoWrapper = new IPinfoWrapper(token);

export const getLocationDetails = async (ip) => {
  try {
    const locationDetails = await ipinfoWrapper.lookupIp(ip);
    if (!locationDetails) {
      return {
        error: true,
        message: "Error: No location details found",
        data: null,
      };
    }

    console.log(locationDetails);
    return {
      error: false,
      message: "Success: Location details found",
      data: locationDetails,
    };
  } catch (error) {
    return {
      error: true,
      message: error.message,
      data: null,
    };
  }
};

export const getTemperature = async (lat, long) => {
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

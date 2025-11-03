import axios from "axios";

class Weather {
  async getWeather(location) {
    try {
      const response = await axios.get(
        `${process.env.VUE_APP_WEATHER_API_URL}/current.json?key=${process.env.VUE_APP_WEATHER_API_KEY}&q=${location}&aqi=no`
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default Weather;

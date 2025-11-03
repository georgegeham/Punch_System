import Weather from "./Classes/Weather";

const BusinessSettins = () => {
  return {
    companyName: null,
    location: null,
    latitude: null,
    longitude: null,
    area: null,
    requireFixedHours: false,
    startHour: null,
    endHour: null,
  };
};

const WeatherData = () => {
  return {
    temperature: null,
    condition: null,
    location: null,
    humidity: null,
    windSpeed: null,
  };
};

const BusinessSlice = {
  state: () => ({
    BusinessSettings: BusinessSettins(),
    weather: WeatherData(),
    loading: false,
    error: null,
  }),
  mutations: {
    setBusinessSettings(state, settings) {
      state.BusinessSettings = settings;
    },
    setWeather(state, weatherData) {
      state.weather = weatherData;
    },
    resetBusinessSettings(state) {
      state.BusinessSettings = BusinessSettins();
      state.weather = WeatherData();
    },
    resetWeather(state) {
      state.weather = WeatherData();
    },
    setStart(state) {
      state.loading = true;
      state.error = null;
    },
    setError(state, error) {
      state.loading = false;
      state.error = error;
    },
    reset(state) {
      state.loading = false;
      state.error = null;
    },
  },
  actions: {
    async setBusinessSettings({ commit }, settings) {
      if (settings.location) {
        commit("setStart");
        try {
          const weather = new Weather();

          const data = await weather.getWeather(settings.location);
          const weatherData = {
            temperature: data.current.temp_c,
            condition: data.current.condition.text,
            location: data.location.name,
            humidity: data.current.humidity,
            windSpeed: data.current.wind_kph,
          };
          commit("setWeather", weatherData);
          const companyData = {
            companyName: settings.name,
            location: settings.location,
            latitude: settings.location.split(",")[0],
            longitude: settings.location.split(",")[1],
            area: settings.area,
            requireFixedHours: settings.requires_hours,
            startHour: settings.start_time,
            endHour: settings.end_time,
          };
          commit("setBusinessSettings", companyData);
        } catch (e) {
          console.log(e);
          commit("setError", e);
        } finally {
          commit("reset");
        }
      }
    },
  },
  getters: {
    BusinessSettings(state) {
      return state.BusinessSettings;
    },
    Weather(state) {
      return state.weather;
    },
    status(state) {
      return {
        loading: state.loading,
        error: state.error,
      };
    },
  },
};

export default BusinessSlice;

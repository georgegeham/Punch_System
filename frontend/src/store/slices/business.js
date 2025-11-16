import Company from "./Classes/Company";
import HR from "./Classes/HR";
import Weather from "./Classes/Weather";

const BusinessSettins = () => {
  return {
    id: null,
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
  namespaced: true,
  state: () => ({
    BusinessSettings: BusinessSettins(),
    weather: WeatherData(),
    records: [],
    loading: false,
    error: null,
  }),
  mutations: {
    setBusinessSettings(state, { type, settings }) {
      switch (type) {
        case "Begin":
          state.loading = true;
          state.error = null;
          break;
        case "Success":
          state.loading = false;
          state.error = null;
          state.BusinessSettings = settings;
          break;
        case "Error":
          state.loading = false;
          state.error = settings;
          break;
      }
    },
    setWeather(state, { type, weatherData }) {
      switch (type) {
        case "Begin":
          state.loading = true;
          state.error = null;
          break;
        case "Success":
          state.loading = false;
          state.error = null;
          state.weather = weatherData;
          break;
        case "Error":
          state.loading = false;
          state.error = weatherData;
          break;
      }
    },
    setRecords(state, { type, records }) {
      switch (type) {
        case "Begin":
          state.loading = true;
          state.error = null;
          break;
        case "Success":
          state.loading = false;
          state.error = null;
          state.records = records;
          break;
        case "Error":
          state.loading = false;
          state.error = records;
          break;
      }
    },
    resetBusinessSettings(state, { type }) {
      switch (type) {
        case "Begin":
          state.loading = true;
          state.error = null;
          break;
        case "Success":
          state.loading = false;
          state.error = null;
          state.BusinessSettings = BusinessSettins();
          state.weather = WeatherData();
          break;
        case "Error":
          state.loading = false;
          state.error = null;
          break;
      }
    },
    createCompany(state, { type }) {
      switch (type) {
        case "Begin":
          state.loading = true;
          state.error = null;
          break;
        case "Success":
          state.loading = false;
          state.error = null;
          break;
        case "Error":
          state.loading = false;
          state.error = null;
          break;
      }
    },
    resetWeather(state, { type }) {
      switch (type) {
        case "Begin":
          state.loading = true;
          state.error = null;
          break;
        case "Success":
          state.loading = false;
          state.error = null;
          state.weather = WeatherData();
          break;
        case "Error":
          state.loading = false;
          state.error = null;
          break;
      }
    },
    resetRecords(state, { type }) {
      switch (type) {
        case "Begin":
          state.loading = true;
          state.error = null;
          break;
        case "Success":
          state.loading = false;
          state.error = null;
          state.records = [];
          break;
        case "Error":
          state.loading = false;
          state.error = null;
          break;
      }
    },
    addRecord(state, { type, record }) {
      switch (type) {
        case "Begin":
          state.loading = true;
          state.error = null;
          break;
        case "Success":
          state.loading = false;
          state.error = null;
          state.records.push(record);
          break;
        case "Error":
          state.loading = false;
          state.error = record;
          break;
      }
    },
  },
  actions: {
    async setBusinessSettings({ commit, dispatch, state }) {
      if (state.loading) return;
      commit("setBusinessSettings", { type: "Begin", settings: null });
      try {
        const company = new Company();
        const response = await company.getAll();
        if (response.company.id) {
          const companyData = {
            id: response.company.id,
            companyName: response.company.name,
            location: response.company.location,
            latitude: response.company.location.split(",")[0],
            longitude: response.company.location.split(",")[1],
            area: response.company.area,
            requireFixedHours: response.company.requires_hours,
            startHour: response.company.start_time,
            endHour: response.company.end_time,
          };
          await commit("setBusinessSettings", {
            type: "Success",
            settings: companyData,
          });
          await dispatch(
            "app/showSnackbar",
            {
              text: response.message || "Business settings loaded successfully",
              color: "success",
            },
            { root: true }
          );
          dispatch("setWeather");
        }
      } catch (e) {
        console.log(e);
        dispatch(
          "app/showSnackbar",
          {
            text:
              e.response?.data?.message || e.message || "Something went wrong",
            color: "error",
          },
          { root: true }
        );
        commit("setBusinessSettings", { type: "Error", settings: e });
      }
    },
    async setWeather({ commit, dispatch, state }) {
      if (state.loading) return;
      commit("setWeather", { type: "Begin", weatherData: null });
      try {
        const weather = new Weather();

        const data = await weather.getWeather(state.BusinessSettings.location);
        const weatherData = {
          temperature: data.current.temp_c,
          condition: data.current.condition.text,
          location: data.location.name,
          humidity: data.current.humidity,
          windSpeed: data.current.wind_kph,
        };
        commit("setWeather", { type: "Success", weatherData });
        dispatch("getRecords");
      } catch (e) {
        commit("setWeather", { type: "Error", weatherData: e });
        dispatch(
          "app/showSnackbar",
          {
            text:
              e.response?.data?.message || e.message || "Something went wrong",
            color: "error",
          },
          { root: true }
        );
      }
    },
    async getRecords({ commit, dispatch, state }) {
      if (state.loading) return;
      commit("setRecords", { type: "Begin", records: null });
      try {
        const hr = new HR();
        const response = await hr.getPunches();
        commit("setRecords", { type: "Success", records: response.data });
      } catch (e) {
        commit("setRecords", { type: "Error", records: e });
        dispatch(
          "app/showSnackbar",
          {
            text:
              e.response?.data?.message || e.message || "Something went wrong",
            color: "error",
          },
          { root: true }
        );
      }
    },
    async createCompany({ commit, dispatch, state }, data) {
      if (state.loading) return;
      commit("createCompany", { type: "Begin" });
      try {
        const company = new Company();
        const response = await company.create(data);
        await dispatch(
          "app/showSnackbar",
          {
            text: response.message || "Company created successfully",
            color: "success",
          },
          { root: true }
        );
        commit("createCompany", { type: "Success" });
        return true;
      } catch (e) {
        dispatch(
          "app/showSnackbar",
          {
            text:
              e.response?.data?.message || e.message || "Something went wrong",
            color: "error",
          },
          { root: true }
        );
        commit("createCompany", { type: "Error" });
        return false;
      }
    },
    addRecord({ commit, dispatch, state }, punch) {
      if (state.loading) return;
      commit("addRecord", { type: "Begin", record: null });
      if (!punch) {
        commit("addRecord", { type: "Error", record: "No record to add" });
        return;
      }
      commit("addRecord", { type: "Success", record: punch });
      dispatch(
        "app/showSnackbar",
        {
          text: "Record added successfully",
          color: "success",
        },
        { root: true }
      );
    },
  },
};

export default BusinessSlice;

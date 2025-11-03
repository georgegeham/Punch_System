import AppSlice from "./slices/app";
import BusinessSlice from "./slices/business";
import EmployeeSlice from "./slices/employee";
import Vue from "vue";
import Vuex from "vuex";
import userSlice from "./slices/user";
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    app: AppSlice,
    business: BusinessSlice,
    employee: EmployeeSlice,
    user: userSlice,
  },
});

export default store;

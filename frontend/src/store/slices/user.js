import Employee from "./Classes/Employee";
import HR from "./Classes/HR";
import User from "./Classes/User";

const user = () => ({
  name: "",
  email: "",
  id: "",
  company: "",
});

const tokenStorage = localStorage.getItem("token");
const roleStorage = localStorage.getItem("role");

const userSlice = {
  namespaced: true,
  state: () => ({
    user: user(),
    token: tokenStorage ? JSON.parse(tokenStorage) : "",
    role: roleStorage ? JSON.parse(roleStorage) : "",
    loading: false,
    error: null,
  }),
  mutations: {
    setUser(state, { type, user }) {
      switch (type) {
        case "Begin":
          state.loading = true;
          state.error = null;
          break;
        case "Success":
          state.loading = false;
          state.error = null;
          state.user = user;
          break;
        case "Error":
          state.loading = false;
          state.error = user;
          break;
      }
    },
    resetUser(state, { type }) {
      switch (type) {
        case "Begin":
          state.loading = true;
          state.error = null;
          break;
        case "Success":
          state.loading = false;
          state.error = null;
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          state.token = "";
          state.role = "";
          state.user = user();
          break;
        case "Error":
          state.loading = false;
          state.error = null;
          break;
      }
    },
    inviteUser(state, { type, err }) {
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
          state.error = err;
          break;
      }
    },
    registerHr(state, { type, err }) {
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
          state.error = err;
          break;
      }
    },
  },
  actions: {
    async setUser({ commit, state }, data) {
      if (state.loading) return;
      commit("setUser", { type: "Begin", data });
      try {
        const loginData = { ...data, role: data.role.toLowerCase() };
        const response = await User.login(loginData);
        commit(
          "app/showSnackbar",
          {
            text: response?.message,
            color: "success",
          },
          { root: true }
        );
        const { user, token } = response;

        if (response.company) user.company = response.company;
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("role", JSON.stringify(user.role));
        console.log(user);
        commit("setUser", { type: "Success", user });
        return true;
      } catch (err) {
        commit("setUser", { type: "Error", user });
        commit(
          "app/showSnackbar",
          {
            text: err?.response?.data?.message || err?.message || "Error",
            color: "error",
          },
          { root: true }
        );
        return false;
      }
    },
    async inviteUser({ commit, state }, data) {
      if (state.loading) return;
      try {
        commit("inviteUser", { type: "Begin", err: null });
        const employee = new Employee();

        const response = await employee.invite(data);
        commit("inviteUser", { type: "Success", err: null });
        commit(
          "app/showSnackbar",
          {
            text: response?.message,
            color: "success",
          },
          { root: true }
        );
        return response;
      } catch (err) {
        commit("inviteUser", {
          type: "Error",
          err: err?.response?.data?.message || err?.message || "Error",
        });
        commit(
          "app/showSnackbar",
          {
            text: err?.response?.data?.message || err?.message || "Error",
            color: "error",
          },
          { root: true }
        );
      }
    },
    async registerHr({ commit, state }, data) {
      if (state.loading) return;
      commit("registerHr", { type: "Begin", err: null });
      try {
        const registerData = { ...data, role: "hr" };
        const hr = new HR();
        const response = await hr.create(registerData);
        commit("registerHr", { type: "Success", err: null });
        commit(
          "app/showSnackbar",
          {
            text: response.message,
            color: "success",
          },
          { root: true }
        );
      } catch (err) {
        commit("registerHr", { type: "Error", err: err }, { root: true });
        commit("app/showSnackbar", {
          text: err?.response?.data?.message || err?.message || "Error",
          color: "error",
        });
      }
    },
    async logout({ commit, dispatch, state }) {
      if (state.loading) return;
      commit("resetUser", { type: "Begin" });
      try {
        const response = await User.logout();
        commit("resetUser", { type: "Success" });
        commit(
          "app/showSnackbar",
          {
            text: response.message || "Logout successful!",
            color: "success",
          },
          { root: true }
        );
      } catch (err) {
        commit("resetUser", { type: "Error" });
        dispatch(
          "app/showSnackbar",
          {
            text: err?.response?.data?.message || err?.message || "Error",
            color: "error",
          },
          { root: true }
        );
      }
    },
  },
};
export default userSlice;

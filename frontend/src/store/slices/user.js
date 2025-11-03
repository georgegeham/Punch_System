const user = () => ({
  name: "",
  email: "",
  token: "",
  role: "",
  id: "",
  company: "",
});

const userSlice = {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || user(),
  }),
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    resetUser(state) {
      state.user = user();
    },
  },
  actions: {
    setUser({ commit }, user) {
      const data = {
        name: user.name,
        email: user.email,
        token: user.token,
        role: user.role,
        id: user.id,
      };
      if (user.company) data.company = user.company;
      localStorage.setItem("user", JSON.stringify(data));
      commit("setUser", data);
    },
    resetUser({ commit }) {
      localStorage.removeItem("user");
      commit("resetUser");
    },
  },
  getters: {
    User(state) {
      return state.user;
    },
    Company(state) {
      return state.user.company;
    },
  },
};
export default userSlice;

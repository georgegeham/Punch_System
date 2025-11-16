const AppSlice = {
  namespaced: true,
  state: () => ({
    snackbarText: "",
    snackbarColor: "",
    snackbarVisible: false,
    selectedCompany: null,
    loading: false,
    error: null,
    success: null,
  }),
  mutations: {
    showSnackbar(state, { text, color = "success" }) {
      state.snackbarText = text;
      state.snackbarColor = color;
      state.snackbarVisible = true;
    },
    hideSnackbar(state) {
      state.snackbarText = "";
      state.snackbarColor = "";
      state.snackbarVisible = false;
    },
    setSelectedCompany(state, company) {
      state.selectedCompany = company;
    },
  },
  actions: {
    showSnackbar({ state, commit }, { text, color = "success" }) {
      if (state.loading) return;
      commit("showSnackbar", { text, color });
    },
    hideSnackbar({ commit }) {
      commit("hideSnackbar");
    },
    setSelectedCompany({ commit }, company) {
      commit("setSelectedCompany", company);
    },
  },
};

export default AppSlice;

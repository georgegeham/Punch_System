const AppSlice = {
  state: () => ({
    snackbarText: "",
    snackbarColor: "",
    snackbarVisible: false,
    selectedCompany: null,
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
  getters: {
    snackbarText(state) {
      return state.snackbarText;
    },
    snackbarColor(state) {
      return state.snackbarColor;
    },
    snackbarVisible(state) {
      return state.snackbarVisible;
    },
    selectedCompany(state) {
      return state.selectedCompany;
    },
  },
};

export default AppSlice;

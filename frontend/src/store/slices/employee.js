import { calculateRadius, timeToMinutes } from "@/components/utils/util";
import Employee from "./Classes/Employee";

const EmployeeSlice = {
  namespaced: true,
  state: () => ({
    employees: JSON.parse(localStorage.getItem("employees")) || [],
    loading: false,
    error: null,
  }),
  mutations: {
    AddEmployee(state, { type, employee }) {
      switch (type) {
        case "Begin":
          state.loading = true;
          state.error = null;
          break;
        case "Success":
          state.employees.push(employee);
          localStorage.setItem("employees", JSON.stringify(state.employees));
          state.loading = false;
          state.error = null;
          break;
        case "Error":
          state.loading = false;
          state.error = employee;
          break;
      }
    },
    resetEmployees(state, { type }) {
      switch (type) {
        case "Begin":
          state.loading = true;
          state.error = null;
          break;
        case "Success":
          localStorage.removeItem("employees");
          state.loading = false;
          state.error = null;
          return (state.employees = []);
        case "Error":
          state.loading = false;
          state.error = null;
          break;
      }
    },
    punch(state, { type, err }) {
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
    AddEmployee({ rootState, commit }, employee) {
      if (this.loading) return;
      this.AddEmployee({ commit }, { type: "Begin", employee });
      try {
        if (rootState.business.BusinessSettings.requireFixedHours) {
          const startTime = timeToMinutes(
            rootState.business.BusinessSettings.startHour
          );
          const endTime = timeToMinutes(
            rootState.business.BusinessSettings.endHour
          );
          if (employee.punchInTime) {
            if (
              timeToMinutes(employee.punchInTime.slice(0, 5)) < startTime ||
              timeToMinutes(employee.punchInTime.slice(0, 5)) > endTime
            ) {
              throw new Error(
                "Punch-in time is outside of fixed working hours."
              );
            }
          } else if (employee.punchOutTime) {
            if (
              timeToMinutes(employee.punchOutTime.slice(0, 5)) < startTime ||
              timeToMinutes(employee.punchOutTime.slice(0, 5)) > endTime
            ) {
              throw new Error(
                "Punch-out time is outside of fixed working hours."
              );
            }
          }
        }
        if (
          employee.distance >
          calculateRadius(rootState.business.BusinessSettings.area)
        ) {
          employee.isWithinArea = false;
        } else {
          employee.isWithinArea = true;
        }
        commit("AddEmployee", { type: "Success", employee });
      } catch (error) {
        commit("AddEmployee", { type: "Error", employee: error });
      }
    },
    async punch({ state, commit }, data) {
      if (state.loading) return;
      commit("punch", { type: "Begin", err: null });
      try {
        const employee = new Employee();
        const response = await employee.punch(data);
        commit(
          "app/showSnackbar",
          {
            text: response.message || "Action successful!",
            color: "success",
          },
          { root: true }
        );
        commit("punch", { type: "Success", err: null });
        return;
      } catch (err) {
        commit("punch", { type: "Error", err });
        commit(
          "app/showSnackbar",
          {
            text: err?.response?.data?.message || err?.message || "Error",
            color: "error",
          },
          { root: true }
        );
        return;
      }
    },
  },
};

export default EmployeeSlice;

import { calculateRadius, timeToMinutes } from "@/components/utils/util";

const EmployeeSlice = {
  state: () => ({
    employees: JSON.parse(localStorage.getItem("employees")) || [],
  }),
  mutations: {
    AddEmployee(state, employee) {
      state.employees.push(employee);
      localStorage.setItem("employees", JSON.stringify(state.employees));
    },
    resetEmployees(state) {
      localStorage.removeItem("employees");
      return (state.employees = []);
    },
  },
  actions: {
    AddEmployee({ rootState, commit }, employee) {
      // console.log(rootState.business);
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
            throw new Error("Punch-in time is outside of fixed working hours.");
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
      commit("AddEmployee", employee);
    },
  },
  getters: {
    Employees(state) {
      return state.employees;
    },
  },
};

export default EmployeeSlice;

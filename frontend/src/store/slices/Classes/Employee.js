/* eslint-disable no-useless-catch */
import api from "@/api/config";

class Employee {
  async invite(email) {
    try {
      const response = await api.post(`/employee/invite`, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async verifyInvite(token) {
    try {
      //   console.log("Token from inside calling function", token);
      const response = await api.get(
        `/employee/invitation/verify?token=${token}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async register(data) {
    try {
      const response = await api.post(`/employee/invitation/register`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // async getAll() {
  //   try {
  //     const response = await api.get(`/employees`);
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  async punch(data) {
    try {
      const response = await api.post(`/employee/punch`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default Employee;

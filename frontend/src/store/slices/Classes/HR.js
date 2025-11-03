/* eslint-disable no-useless-catch */
import api from "@/api/config";
export default class HR {
  async create(data) {
    try {
      const response = await api.post(`/register`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getPunches() {
    try {
      const response = await api.get(`/employee/punches`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

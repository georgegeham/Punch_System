/* eslint-disable no-useless-catch */
import api from "@/api/config";

class Company {
  async create(data) {
    try {
      const response = await api.post(`/companies`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async update(id, data) {
    try {
      const response = await api.put(`/companies/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async delete(id) {
    try {
      const response = await api.delete(`/companies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async get(id) {
    try {
      const response = await api.get(`/companies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getAll() {
    try {
      const response = await api.get(`/companies`);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default Company;

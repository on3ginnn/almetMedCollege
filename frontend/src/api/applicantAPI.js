import { apiClient } from "../config/APIClient";

export default class ApplicantAPI {
    static async create(data) {
        try {
            const response = await apiClient.post('/applicants/', data);
            return response;
        } catch (error) {
            throw error; // Let caller handle errors
        }
    }
    static async getApplicantList() {
        try {
            const response = await apiClient.get('/applicants/');
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async get(pk) {
        try {
            const response = await apiClient.get(`/applicants/${pk}/`);
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async download(pk) {
        try {
            const response = await apiClient.get(`/applicants/${pk}/download/`, {
                responseType: 'blob', // Handle binary file
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
}
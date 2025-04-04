import { apiClient } from "../config/APIClient";

export default class MajorAPI {
    static async getMajorList() {
        try {
            const response = await apiClient.get(`/major/all/`);
            return response;
        } catch (error) {
            throw error;
        }
    }
}
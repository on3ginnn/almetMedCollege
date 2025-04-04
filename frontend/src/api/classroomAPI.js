import { apiClient } from "../config/APIClient";

export default class ClassroomAPI {
    static async getClassroomList() {
        try {
            const response = await apiClient.get(`/schedule/classroom/`);
            return response;
        } catch (error) {
            throw error;
        }
    }
}
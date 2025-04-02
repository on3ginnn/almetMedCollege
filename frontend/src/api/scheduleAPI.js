import { apiClient } from "./../config/APIClient";

export default class ScheduleAPI {
    static async getSchedule(data) {
        try {
            const response = await apiClient.get(`/schedule/`, {params: data});
            return response;
        } catch (error) {
            console.error(error);
        }
    }
}
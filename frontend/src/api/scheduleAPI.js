import { apiClient } from "./../config/APIClient";

export default class ScheduleAPI {
    static async getSchedule(date, group) {
        try {
            const response = await apiClient.get(`/schedule/`, {params: {date: date, group: group}});
            return response;
        } catch (error) {
            console.error(error);
        }
    }
}
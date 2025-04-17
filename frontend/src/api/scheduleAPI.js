import { apiClient } from "./../config/APIClient";

export default class ScheduleAPI {
    static async getSchedule(date, group) {
        try {
            console.log(date)
            console.log(group)
            const response = await apiClient.get(`/schedule/`, {params: {date: date, group: group}});
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    static async createSchedule(scheduleData) {
        try {
            const response = await apiClient.post('/schedule/create/', scheduleData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    static async getBusyTeachers(date) {
        try {
            const response = await apiClient.get(`/schedule/teacher/busy/`, {params: {date: date}});
            console.log(response.data)
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async getBusyClassrooms(date) {
        try {
            const response = await apiClient.get(`/schedule/classroom/busy/`, {params: {date: date}});
            console.log(response.data)
            return response;
        } catch (error) {
            throw error;
        }
    }
}
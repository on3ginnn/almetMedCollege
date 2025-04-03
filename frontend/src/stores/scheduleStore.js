import { create } from "zustand";
import ScheduleAPI from '../api/scheduleAPI';
import GroupAPI from '../api/groupAPI';

export const useScheduleStore = create((set) => ({
    schedule: null,
    getSchedule: async (date, group) => {
        try {
            const response = await ScheduleAPI.getSchedule(date, group);
            console.warn(`get schedule with code ${response.status}`);
            set({ schedule: response.data});
        } catch (error) {
            console.error('Ошибка при получении расписания:', error);
            // throw error; // Перебрасываем ошибку для обработки выше
        } finally{
            console.warn(`get schedule with code ${response.status}`);
        }
    },
    getGroupList: async () => {
        try{
            const response = await GroupAPI.getGroupList();
            console.warn(`get schedule with code ${response.status}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении списка групп:', error);
        }
    }
}));
import { create } from "zustand";
import ScheduleAPI from '../api/scheduleAPI';


export const scheduleStore = create((set) => ({
    schedule: null,
    getSchedule: async (date, group) => {
        try {
            const response = await ScheduleAPI.getSchedule(date, group);
            console.warn(`get schedule with code ${response.status}`);
            set({ schedule: response.data});
        } catch (error) {
            console.error('Ошибка при получении расписания:', error);
            throw error; // Перебрасываем ошибку для обработки выше
        }
    },
}));
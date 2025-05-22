import { create } from "zustand";
import ScheduleAPI from '../api/scheduleAPI';
import GroupAPI from '../api/groupAPI';
import MajorAPI from '../api/majorAPI';
import UserAPI from '../api/userAPI';
import ClassRoomAPI from '../api/classroomAPI';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; // Русский язык

dayjs.locale('ru'); // Установить локаль по умолчанию


export const useScheduleStore = create((set, get) => ({
    schedule: null,
    currentGroup: null,
    currentDate: dayjs(),
    isLoading: false,
    groups: [],
    majors: [],
    teachers: [],
    classRooms: [],
    
    // Получение расписания
    getSchedule: async () => {
        try {
            set({ isLoading: true });
            const { currentDate, currentGroup } = get();
            const data = await ScheduleAPI.getSchedule(
                currentDate.format("YYYY-MM-DD"), 
                currentGroup?.id
            );
            set({ schedule: data, isLoading: false });
        } catch (error) {
            set({ schedule: null, isLoading: false });
            console.error('Ошибка при получении расписания:', error);
        }
    },
    
    // Создание расписания
    createSchedule: async (scheduleData) => {
        try {
            set({ isLoading: true });
            const response = await ScheduleAPI.createSchedule(scheduleData);
            set({ isLoading: false });
            return response;
        } catch (error) {
            set({ isLoading: false });
            console.error('Ошибка при создании расписания:', error);
            throw error;
        }
    },
    
    // Получение списка групп
    getGroupList: async () => {
        try {
            const response = await GroupAPI.getGroupList();
            set({ groups: response.data });
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении списка групп:', error);
        }
    },
    
    // Получение списка специальностей
    getMajorList: async () => {
        try {
            const response = await MajorAPI.getMajorList();
            set({ majors: response.data });
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении списка специальностей:', error);
        }
    },
    
    // Получение списка преподавателей
    getTeacherList: async () => {
        try {
            const response = await UserAPI.getTeacherList();
            set({ teachers: response.data });
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении списка преподавателей:', error);
        }
    },
    
    // Получение списка аудиторий
    getClassroomList: async () => {
        try {
            const response = await ClassRoomAPI.getClassroomList();
            set({ classRooms: response.data });
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении списка аудиторий:', error);
        }
    },
    getBusyTeachers: async (date) => {
        try{
            const response = await ScheduleAPI.getBusyTeachers(date);
            console.log(response.data)
            return response;
        } catch (error) {
            console.error('Ошибка при получении списка занятых преподавателей');
        }
    },
    getBusyClassrooms: async (date) => {
        try{
            const response = await ScheduleAPI.getBusyClassrooms(date);
            console.log(response.data)
            return response;
        } catch (error) {
            console.error('Ошибка при получении списка занятых кабинетов');
        }
    },
    setCurrentGroup: (newGroup) => set({ currentGroup: newGroup }),
    setCurrentDate: (newDate) => set({ currentDate: newDate }),
}));
import { atom } from 'jotai';
import UserAPI from './../api/userAPI';

import {create} from 'zustand';

export const useUserStore = create((set) => ({
  userRole: null, // Первоначально роль не установлена
  setUserRole: (role) => set({ userRole: role }),
}));


export const isAuth = atom(false);

class UserStore{
    async createUser(data){
        try {
            const response = await UserAPI.register(data);
            if (response.status == 200){
                console.log("Пользователь успешно добавлен")
            } else {
                console.log(response.status)
                throw new Error(response.status);
            }
        } catch (error) {
            console.log(error)
            console.error("Ошибка создания пользователя", error.response);
        }
    }
    async getUserList(){
        try {
            const response = await UserAPI.getUserList();
            return response;
        } catch (error) {
            console.error(error);
        }
    }
    async getProfile(){
        try {
            const res_data = await UserAPI.getProfile();
            console.log(res_data);
            if (res_data) { // Проверка статуса ответа
                useUserStore.setState({ userRole: res_data.role }); // Обновляем роль пользователя

                return res_data;
            } else {
                throw new Error(`нету юзера`);
            }
        } catch (error) {
            console.error('Ошибка при получении профиля:', error);
            throw error; // Перебрасываем ошибку для обработки выше
        }
    }
    async loginUser(data){
        try {
            const response = await UserAPI.login(data);
            if (response.status == 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }
    async logoutUser(){
        try {
            const response = await UserAPI.logout();
            console.log(response);

            if (response.status == 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    async setUser(data){
        try {
            const response = await UserAPI.setUser(data);
        } catch (error) {
        }
    }
    async deleteUser(){
        try {
            const response = await UserAPI.deleteUser();
        } catch (error) {
            console.log(error.response.data.message);

        }
    }
}
export let userStore = new UserStore();
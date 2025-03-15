import { atom } from 'jotai';
import userAPI from './../api/userAPI';

export const isAuth = atom(false);

class UserStore{
    async addUser(data){
        try {
            const response = await UserAPI.register(data);
        } catch (error) {
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
    async getUserList(){
        try {
            const response = await UserAPI.getUsers();

            this.userList = response.data;
            return response;
        } catch (error) {
        }
    }
    async getProfile(){
        try {
            const res_data = await userAPI.getProfile();
            console.log(res_data);
            if (res_data) { // Проверка статуса ответа
                return res_data;
            } else {
                throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Ошибка при получении профиля:', error);
            throw error; // Перебрасываем ошибку для обработки выше
        }
    }
    async loginUser(data){
        try {
            const response = await userAPI.login(data);
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
            const response = await userAPI.logout();
            console.log(response);

            if (response.status == 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }
}
export let userStore = new UserStore();
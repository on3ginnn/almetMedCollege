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
            const response =  userAPI.getProfile();
            console.log(response.data);
            if (response.ok) { // Проверка статуса ответа
                return response.data;
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

            if (response.ok) {
                return true;
            }
            return false;
            
        } catch (error) {
            
        }
    }
    logout(){
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('isAuth');
        this.accessToken = '';
    }
}
export let userStore = new UserStore();
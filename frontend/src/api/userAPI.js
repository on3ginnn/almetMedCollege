import { apiClient } from "./../config/APIClient";

export default class UserAPI {
    static async register(data){
        try {
            const response = await apiClient.post('/user/create/', data);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    static async login(data){
        try {
            const response = await apiClient.post('/login/', data);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    static async getProfile() {
        try {
            const response = await apiClient.get('/user/profile/');
            const res_data = response.data;
            console.log(res_data);
            return res_data;
            return response;
        } catch (error) {
            console.error(error.response.data.message);
            if (error.response.status === 401) {
                console.error('Требуется повторный вход в систему');
            }
        }
    }
    static async logout(){
        try{
            const response = await apiClient.get("logout");
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    static async setUser(data){
        try {

            const response = await apiClient.patch(`/auth/user/${userId}/`, data);
            return response;
        } catch (error) {
            console.log(error.response?.data?.message || error.message);
        }
    }
    static async deleteUser(){
        try{
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Токен не найден');
            }

            // Декодируем токен для получения userId
            const decoded = jwtDecode(token);
            const userId = decoded.user_id || decoded.id; // Убедитесь, какое поле содержит ID

            if (!userId) {
                throw new Error('ID пользователя не найден в токене');
            }

            console.log('UserID из токена:', userId);

            const response = await apiClient.delete(`/auth/user/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
            );
            return response;
        } catch (error) {
            return error;
        }
    }
    static async getUsers(){
        try{
            const response = await apiClient.get("/auth/users/");
            return response;
        } catch (error) {
            return error;
        }
    }
}
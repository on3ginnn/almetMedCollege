import { apiClient } from "./../config/APIClient";

export default class UserAPI {
    static async register(data){
        try {
            const response = await apiClient.post('/user/create/', data);
            return response;
        } catch (error) {
            console.error(error);
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
            return response;
        } catch (error) {
            // console.error(error);
            if (error.response.status === 401) {
                console.error('Требуется повторный вход в систему');
            }
            return response;
        }
    }
    static async getUser(pk) {
        try {
            const response = await apiClient.get(`/user/${pk}/`);
            return response;
        } catch (error) {
            console.error(error);
        }
    }
    static async logout(){
        try{
            const response = await apiClient.get("logout/");
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    static async getUserList(){
        try{
            const response = await apiClient.get("/user/all/");
            return response;
        } catch (error) {
            return error;
        }
    }
    static async getTeacherList(){
        try{
            const response = await apiClient.get("/user/teacher/");
            return response;
        } catch (error) {
            return error;
        }
    }
    static async updateUser(pk, data){
        try {
            console.log(data);
            const response = await apiClient.patch(`/user/${pk}/`, data);
            return response;
        } catch (error) {
            console.error(error);
        }
    }
    static async deleteUser(pk){
        try{
            const response = await apiClient.delete(`/user/${pk}/`);
            return response;
        } catch (error) {
            return error;
        }
    }
}
import { apiClient } from "./../config/APIClient";

export class NewsAPI {
    static async newsList(){
        try{
            const response = await apiClient.get('news/all/');
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
    static async newsCreate(data) {
        try{
            const response = await apiClient.post('news/create/', data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
    static async newsUpdate(data) {
        try{
            const response = await apiClient.patch(`news/${data.id}/`, data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
    static async newsDelete(pk){
        try {
            const response = await apiClient.delete(`news/${pk}`);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}
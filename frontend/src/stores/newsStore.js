import { NewsAPI } from "../api/newsAPI";
import {create} from 'zustand';

export const useNewsStore = create((set) => ({
  newsList: [],
  getNewsList: async ()=>{
    try {
        const res_data = await NewsAPI.newsList();
        if (res_data) {
            // console.log(res_data);
            set({newsList:res_data});
        }
        return response;
    } catch (error) {
        console.error(error);
    }
  },
  createNews: async (data) => {
    try{
        const response = await NewsAPI.newsCreate(data);
        if (response) {
            set((state) => ({ newsList: [...state.newsList, response] }));
        }
    } catch (error) {
        console.error('Ошибка добавления новости: ', error);
    }
  },
  updateNews: async (data) => {
    try{
      const response = await NewsAPI.newsUpdate(data);
      if (response) {
        set((state) => ({ newsList: state.newsList.map((news) => news.id === response.id ? response : news) }));
      }
    } catch (error) {
      console.error('Ошибка редактирования новости: ', error);
    }
  },
  deleteNews: async (pk) => {
    try {
        const response = await NewsAPI.newsDelete(pk);
        console.log(response);
        if (response.status === 204) {
          set((state) => ({ newsList: state.newsList.filter((news) => news.id !== pk) }));
        }
    } catch (error) {
        console.error('Ошибка удаления новости', error);
    }
  }
}));
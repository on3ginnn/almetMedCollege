import axios from 'axios';

export const apiClient = axios.create({
    baseURL:"https://demoalmetmed.ru/",
    withCredentials: true,
})
import UserAPI from "../api/userAPI";
import {create} from 'zustand';

export const useUserStore = create((set) => ({
    userList: [],
    currentUser: null,
    userRole: null, // Первоначально роль не установлена
    isLoading: true,
    // getProfile: async () => {
    //     try {
    //         const response = await UserAPI.getProfile();
    //         console.warn(`get profile user with code ${response.status}`);
    //         // if (res_data) { // Проверка статуса ответа
    //         if (response.status === 200) { // Проверка статуса ответа
    //             useUserStore.setState({ currentUser: response.data });
    //         } else {
    //             throw new Error(`нету юзера`);
    //         }
    //     } catch (error) {
    //         console.error('Ошибка при получении профиля:', error);
    //         throw error; // Перебрасываем ошибку для обработки выше
    //     }
    // },
    getProfile: async () => {
        set({ isLoading: true });
        try {
            const response = await UserAPI.getProfile();
            console.warn(`get profile user with code ${response.status}`);
            if (response.status === 200) { // Проверка статуса ответа
                set({ currentUser: response.data, isLoading: false });
            } else {
                set({ isLoading: false });
                throw new Error(`нету юзера`);
            }
        } catch (error) {
            set({ currentUser: null, isLoading: false });
        }
    },
    logoutUser: async () => {
        try {
            const response = await UserAPI.logout();
            console.log(`logout user with code ${response.status}`);
        } catch (error) {
            console.log(error);
        } finally {
            set({ currentUser: null });
        }
    },
    setUserRole: (role) => set({ userRole: role }),
    getUserList: async ()=>{
        try {
            const response = await UserAPI.getUserList();
            console.warn(`get user list with code ${response.status}`);

            if (response.status === 200) {
                // console.log(res_data);
                set({ userList:response.data });
            }
        } catch (error) {
            console.error(error);
        }
    },
    createUser: async (data) => {
        try {
            const response = await UserAPI.register(data);
            console.warn(`create user with code ${response.status}`);

            if (response.status == 201){
                console.log("Пользователь успешно добавлен")
            } else {
                throw new Error(response.status);
            }
        } catch (error) {
            console.log(error)
            console.error("Ошибка создания пользователя", error);
        }
    },
    updateUser: async (pk, data) => {
        try{
            const response = await UserAPI.updateUser(pk, data);
            console.warn(`update user with code ${response.status}`);

            if (response.state === 200) {
                set((state) => ({ userList: state.userList.map((user) => user.id === response.id ? response : user) }));
            }
        } catch (error) {
            console.error('Ошибка редактирования новости: ', error);
        }
    },
    deleteUser: async (pk) => {
        try {
            const response = await UserAPI.deleteUser(pk);
            console.warn(`delete user with code ${response.status}`);
            if (response.status === 204) {
                set((state) => ({ userList: state.userList.filter((user) => user.id !== pk) }));
            }
        } catch (error) {
            console.error('Ошибка удаления новости', error);
        }
    },
    loginUser: async (data) => {
        try {
            const response = await UserAPI.login(data);
            console.log(`login with code ${response.status}`);
            
            if (response.status === 200) {
                // сразу получаем профиль пользователя после успешного входа
                await useUserStore.getState().getProfile();
            } else {
                throw new Error("Неверный статус логина");
            }
        } catch (error) {
            console.log(error);
        }
    },
    getUser: async (pk) => {
        try {
            const response = await UserAPI.getUser(pk);
            console.warn(`get user with code ${response.status}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении пользователя:', error);
            throw error; // Перебрасываем ошибку для обработки выше
        }
    }
}));
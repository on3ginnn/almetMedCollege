import UserAPI from "../api/userAPI";
import {create} from 'zustand';

export const useUserStore = create((set) => ({
    userList: [],
    currentUser: null,
    userRole: null, // Первоначально роль не установлена
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
            // if (response.status == 200) {
            //     return true;
            // }
        } catch (error) {
            console.log(error);
        }
    },
    getProfile: async () => {
        try {
            const response = await UserAPI.getProfile();
            console.warn(`get profile user with code ${response.status}`);
            // if (res_data) { // Проверка статуса ответа
            if (response.status === 200) { // Проверка статуса ответа
                useUserStore.setState({ currentUser: response.data });
            } else {
                throw new Error(`нету юзера`);
            }
        } catch (error) {
            console.error('Ошибка при получении профиля:', error);
            throw error; // Перебрасываем ошибку для обработки выше
        }
    },
    logoutUser: async () => {
        try {
            const response = await UserAPI.logout();
            set({ currentUser: null} );
            console.log(`logout user with code ${response.status}`);
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
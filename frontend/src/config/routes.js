// import Home from "../components/home";
// import Register from "../components/register";
// import Auth from "../components/auth";
// import Profile from "../components/profile";
// import UserList from "../components/users/user_list";
// import Categories from "../components/categories/categories";
// import Products from "../components/products/products";
// import addCategory from "../components/categories/add_category";
// import addProduct from "../components/products/add_product";
// import editCategory from "../components/categories/edit_category";

import LoginForm from "../components/login";
import HomePage from "../components/homepage";


export const publicRoutes = [
    {
        name:'Главная',
        path:'/',
        component:HomePage
    },
//     {
//         name:'Категории',
//         path:'/categories',
//         component:Categories
//     },
//     {
//         name:'Товары',
//         path:'/products',
//         component:Products
//     },
//     {
//         name:'Регистрация',
//         path:'/register',
//         component:Register
//     },
    {
        name: 'Войти',
        path: '/login',
        component:LoginForm
    }

];
// export const authRoutes = [
//     {
//         name:'Профиль',
//         path:'/profile',
//         component:Profile
//     },
//     {
//         name:'Пользователи',
//         path:'/users',
//         component:UserList
//     },
//     {
//         name:'Главная',
//         path:'/',
//         component:Home
//     },
//     {
//         name:'Категории',
//         path:'/categories',
//         component:Categories
//     },
//     {
//         name:'Товары',
//         path:'/products',
//         component:Products
//     }
// ];
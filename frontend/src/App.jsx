import MainContent from './mainContent';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as React from 'react';
import {LoginForm } from './components/users/login';
import { HomePage } from './components/homepage';
import { ProtectedRoute } from './config/ProtectedRoute';
import { UserForm } from './components/users/userForm';
import { UserList } from './components/users/userList';
import { NewsList } from './components/news/news';
import { NewsForm } from "./components/news/newsForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainContent />} >
          <Route index element={<HomePage />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path="/user" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/user/all" element={<UserList />} />
            <Route path="/user/create" element={<UserForm />} />
            <Route path="/user/edit/:id" element={<UserForm />} />
          </Route>
          <Route path='/news' element={<NewsList />} />
          <Route path="/news" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/news/create" element={<NewsForm />} />
            <Route path="/news/edit/:id" element={<NewsForm />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

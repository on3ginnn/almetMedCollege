import MainContent from './mainContent';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as React from 'react';
import {LoginForm } from './components/users/login';
import { HomePage } from './components/homepage';
import { ProtectedRoute } from './config/ProtectedRoute';
import { UserCreateForm } from './components/users/userCreate';
import { UserList } from './components/users/userList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainContent />} >
          <Route index element={<HomePage />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path="/user" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/user/all" element={<UserList />} />
            <Route path="/user/create" element={<UserCreateForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

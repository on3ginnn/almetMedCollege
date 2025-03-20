import MainContent from './mainContent';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as React from 'react';
import {LoginForm } from './components/login';
import { HomePage } from './components/homepage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserCreateForm } from './components/userCreate';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainContent />} >
          <Route index element={<HomePage />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path="/user" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/user/all" element={<LoginForm />} />
            <Route path="/user/create" element={<UserCreateForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { useState } from 'react'
import MainContent from './mainContent';
// import Main from './components/main';
import { BrowserRouter } from 'react-router-dom';
import * as React from 'react';
import { BrowserRouter, Routes, Route } from "react-router";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LoginForm from './components/login';

function App() {
  return (
    // <Container>
        // <MainContent />
    <LoginForm />
    // </Container>
    // <BrowserRouter>
    // <Header/>
    // <Main/>
    // </BrowserRouter>

  )
    
}

export default App

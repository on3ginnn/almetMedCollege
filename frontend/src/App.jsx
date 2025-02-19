import { useState } from 'react'
import MainContent from './mainContent';
// import Main from './components/main';
import { BrowserRouter } from 'react-router-dom';
import * as React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <MainContent />

      </Box>
    </Container>
    // <BrowserRouter>
    // <Header/>
    // <Main/>
    // </BrowserRouter>

  )
    
}

export default App

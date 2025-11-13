import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import './App.css';

import { Container, Typography, CssBaseline } from '@mui/material';

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          style={{ textAlign: 'center' }}
        >
          News Sentiment Dashboard
        </Typography>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analysis/:topic" element={<AnalysisPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
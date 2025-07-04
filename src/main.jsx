import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './css/index.css';
import App from './App.jsx';
import { UserProvider } from './contexts/UserContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider> 
          <App />
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);

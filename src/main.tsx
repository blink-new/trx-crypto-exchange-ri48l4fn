import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { CustomThemeProvider } from './context/CustomThemeContext';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <CustomThemeProvider>
        <App />
          </CustomThemeProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  </BrowserRouter>
);
import React from 'react';
import Home from './pages/home'
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';

function App() {
  return (
    <React.StrictMode>

      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;




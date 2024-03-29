
import './App.css';
import QuestionForm from './QuestionForm';

import theme from './theme';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Navigation from './Navigation'; 
import QuestionSearch from './QuestionSearch';
import { ThemeProvider } from './theme-context';
import CssBaseline from '@mui/material/CssBaseline'; // Helps with consistent background and resets


function App() {
  return (
    
    <ThemeProvider>
       <CssBaseline />
      <Navigation /> 
    
       
          

          <Routes> 
            <Route path="/submit-question" element={<QuestionForm />} />
            <Route path="/search" element={<QuestionSearch />} />
            
          </Routes>
    
      
    </ThemeProvider>
  );
}

export default App;
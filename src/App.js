
import './App.css';
import QuestionForm from './QuestionForm';


import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navigation from './Navigation'; 
import QuestionSearch from './QuestionSearch';
import { ThemeProvider } from './theme-context';
import CssBaseline from '@mui/material/CssBaseline'; // Helps with consistent background and resets
import {Link} from 'react-router-dom'
import {  Button, Box } from '@mui/material';



function App() {
  const location = useLocation();


  const isHome = location.pathname === '/';
  return (
    
    <ThemeProvider>
       <CssBaseline />
      <Navigation /> 
    
      {isHome && (
        <div className="home-text">
          <h1>Welcome to the Data for Action Question Bank</h1>
          <h4>The Question Bank is part of our approach to creating open infrastructure for action. We believe that by sharing the questions we are trying answer openly we can work collaboratively to solve them</h4>
          <h4>Here you can add your questions, find other questions, add ideas or resources that might help answer these questions or find collaborators to work with to do so</h4>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: '10px' }}> 
          <Button component={Link} to='/submit-question' variant="outlined" color="secondary" sx={{ my: 1, mx: 1.5 }} text style={{ borderRadius: '20px' }}>
            Submit Question
          </Button>
          <Button component={Link} to='/search' variant="outlined" color="secondary" sx={{ my: 1, mx: 1.5 }} text style={{ borderRadius: '20px' }}>
            Search Questions
          </Button>
          </Box>
        </div>
      )}


          <Routes> 
            <Route path="/submit-question" element={<QuestionForm />} />
            <Route path="/search" element={<QuestionSearch />} />
            
          </Routes>
    
      
    </ThemeProvider>
  );
}

export default App;
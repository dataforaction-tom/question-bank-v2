import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, IconButton, Box, Switch } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Link} from 'react-router-dom'
import { useThemeMode } from './theme-context'; 




function Navigation() {
  const { toggleThemeMode } = useThemeMode(); 
  return (
    <AppBar position="static" color="primary" elevation={0} sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', overflowX: 'auto' }}>
          {/* Logo and Menu Icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: '10px' }}> 
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ display: { sm: 'none' }, mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              component="img"
              src="./DFA-white-orange.png"
              alt="Logo"
              sx={{ height: 60 }} 
            />
          </Box>
          
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, color:"#fff", pl: 8 }}
            
          >
           Question Bank
          </Typography>
          <Button component={Link} to='/submit-question' variant="outlined" color="secondary" sx={{ my: 1, mx: 1.5 }} text style={{ borderRadius: '20px' }}>
            Submit Question
          </Button>
          <Button component={Link} to='/search' variant="outlined" color="secondary" sx={{ my: 1, mx: 1.5 }} text style={{ borderRadius: '20px' }}>
            Search Questions
          </Button>
      
          <Switch onChange={toggleThemeMode} /> 
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navigation;



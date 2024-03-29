import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import {TextField, Select, MenuItem, Button, Grid, Card, CardContent, Typography, Pagination, Container,  FormControl} from '@mui/material';
import IconButton from '@mui/material/IconButton';

import StarIcon from '@mui/icons-material/Star';
import { useTheme } from '@mui/material/styles';






function QuestionSearch() {
  const theme = useTheme(); // Using the useTheme hook to access the current theme for materialUI
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [fetchedResults, setFetchedResults] = useState([]);
  const [displayedResults, setDisplayedResults] = useState([]);
  const [categories, setCategories] = useState([{ name: '', id: null }]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('id, name');
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories([{ name: '', id: null }, ...data]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * 6;
    const paginatedItems = fetchedResults.slice(startIndex, startIndex + 6);
    if (categoryFilter === '') {
      setDisplayedResults(paginatedItems);
    } else {
      const filteredResults = fetchedResults.filter(result => result.category_id === categoryFilter);
      setDisplayedResults(filteredResults.slice(startIndex, startIndex + 6));
    }
    setTotalPages(Math.ceil(fetchedResults.length / 6));
  }, [categoryFilter, fetchedResults, currentPage]);

  const handleSearch = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .ilike('question', `%${searchTerm}%`)
        .order('priority', { ascending: false }); // Order by priority descending

      if (error) {
        console.error('Search error:', error);
      } else {
        setFetchedResults(data);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error executing search:', error);
    }
    
  };
  const handleUpvote = async (questionId) => {
    // Fetch the current priority value
    const { data: currentData, error: fetchError } = await supabase
      .from('questions')
      .select('priority')
      .eq('id', questionId)
      .single();
  
    if (fetchError) {
      console.error('Error fetching current priority:', fetchError);
      return;
    }
  
    // Check if we successfully fetched the record
    if (currentData) {
      const currentPriority = currentData.priority;
      const newPriority = currentPriority + 1;
  
      // Update the priority with the incremented value
      const { error: updateError } = await supabase
        .from('questions')
        .update({ priority: newPriority })
        .eq('id', questionId);
  
      if (updateError) {
        console.error('Error upvoting question:', updateError);
      } else {
        console.log('Question upvoted successfully');
        handleSearch(); 
      }
    } else {
      console.error('No question found with the provided ID:', questionId);
    }
  };
  
 

  return (
    <>
    
      <Container maxWidth="sm" style={{ marginTop: '20px', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(248,96,177,0.1)', padding: '20px', backgroundColor: theme.palette.mode === 'light' ? '#f4f4f4' : theme.palette.background.default,  }}>
      <FormControl fullWidth>
      
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for questions..."
          fullWidth
          margin="normal"
          id="categorySearch"
          color="info"
          label="Search Questions"
          
        />
        
        <Select
        
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          id="categoryFilter"
          label="Filter by category"
          fullWidth
          margin="normal"
          color="info"
        >
          {categories.map((category) => (
            <MenuItem key={category.id || ''} value={category.id}>{category.name}</MenuItem>
          ))}
        </Select>
        <Button className="button" onClick={handleSearch} variant="contained" text style={{ borderRadius: '20px', marginTop: '10px'}}>Search</Button>
        </FormControl>
      </Container>
      
      <Grid container spacing={2} style={{ padding: '20px' }}>
        {displayedResults.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{item.question}</Typography>
                <Typography color="textSecondary">Action: {item.action}</Typography>
                <Typography color="textSecondary">Submitted by: {item.name}</Typography>
                <Typography color="textSecondary">Organisation: {item.organisation}</Typography>
                <IconButton onClick={() => handleUpvote(item.id)} color="info">
                  <StarIcon />
                </IconButton>
                {item.priority || 0} {/* Display the current priority */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, page) => setCurrentPage(page)}
          style={{ display: 'flex', justifyContent: 'center', paddingBottom: '20px' }}
        />
      )}
    </>
  );
}

export default QuestionSearch;



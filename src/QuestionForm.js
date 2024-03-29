import React, { useState } from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Container, Grid, Card, CardContent, Typography, IconButton, Pagination, CardActions, Box } from '@mui/material';

import { supabase } from './supabaseClient';
import axios from 'axios'; 
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useTheme } from '@mui/material/styles';



function QuestionForm() {
  const theme = useTheme(); // Using the useTheme hook to access the current theme for materialUI
  
  const [similarQuestions, setSimilarQuestions] = useState([]);
  const [upvotedQuestions, setUpvotedQuestions] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5; // Adjust based on your preference


  const handleUpvote = async (questionId) => {
    // Fetch the current priority of the question
    const { data, error: fetchError } = await supabase
      .from('questions')
      .select('priority')
      .eq('id', questionId)
      .single();
  
    if (fetchError) {
      console.error('Error fetching question priority:', fetchError);
      return;
    }
  
    // Check if the question was fetched successfully
    if (data) {
      const currentPriority = data.priority;
      const newPriority = currentPriority + 1;
  
      // Update the question with the incremented priority
      const { error: updateError } = await supabase
        .from('questions')
        .update({ priority: newPriority })
        .eq('id', questionId);
  
      if (updateError) {
        console.error('Error updating question priority:', updateError);
      } else {
        // Update local state to reflect the new priority
        const updatedQuestions = similarQuestions.map(question => {
          if (question.id === questionId) {
            return { ...question, priority: newPriority };
          }
          return question;
        }).sort((a, b) => b.priority - a.priority); // Re-sort questions by priority if necessary
  
        setSimilarQuestions(updatedQuestions);
        setUpvotedQuestions(prevUpvoted => [...prevUpvoted, questionId]); // Add to upvoted list
      }
    } else {
      console.error('No question found with the provided ID:', questionId);
    }
  };
  

  const formik = useFormik({
    initialValues: {
      question: '',
      action: '',
      name: '',
      email: '',
      organisation: '',
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log('Form submission values:', values);

        // Generate the embedding and get the category name
        const embeddingResponse = await axios.post('/api/generateEmbedding', {
          question: values.question,
        });
        const embedding = embeddingResponse.data.embedding;
        const categoryName = embeddingResponse.data.category.toLowerCase();
        console.log('Embedding:', embedding);
        console.log('Category from embeddingResponse:', categoryName);

        let categoryId;
        // Step 1: Check if the category exists or insert it
        const { data: existingCategory, error: findError } = await supabase
          .from('categories')
          .select('id')
          .ilike('name', categoryName)
          .maybeSingle();

          console.log('Existing category fetch result:', existingCategory);

        if (findError) {
          console.error('Error checking for existing category:', findError);
          return;
        }

        if (existingCategory) {
          categoryId = existingCategory.id;
          console.log(`Using existing category ID: ${categoryId}`);
        } else {
          console.log(`Category '${categoryName}' not found, attempting to insert.`);
          const { data: newCategory, error: insertError } = await supabase
            .from('categories')
            .insert([{ name: categoryName }])
            .select('*')
            .single();

          if (insertError) {
            console.error('Error inserting new category:', insertError);
            return;
          }
          categoryId = newCategory.id;
          console.log(`New category inserted, ID: ${categoryId}`);
        }

        // Step 2: Insert the question with the category ID
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .insert([{ ...values, embedding: embedding, category_id: categoryId }]);

        if (questionError) {
          console.error('Error inserting the question:', questionError);
          return;
        }
        console.log('Data inserted with category:', questionData);

        // Search for similar questions
        const { data: similarData, error: searchError } = await supabase
          .rpc('match_questions', { query_embedding: embedding, match_threshold: 0.7 });

        if (searchError) {
          console.error('Error searching for similar questions:', searchError);
          return;
        }

        console.log('Similar questions found:', similarData);
        setSimilarQuestions(similarData);
        resetForm({});
      } catch (error) {
        console.error('Error in form submission:', error);
      }
    },
  });

  const indexOfLastQuestion = currentPage * itemsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - itemsPerPage;
  const currentQuestions = similarQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const totalQuestions = similarQuestions.length;
  const paginate = (event, value) => setCurrentPage(value);



  return (
    <>
    <Box className="center">
      <h4>Add your question to the Question Bank below</h4>
    </Box>
    <Container maxWidth="sm" style={{
        backgroundColor: theme.palette.mode === 'light' ? '#f4f4f4' : theme.palette.background.default, // Adjusting the background color based on the theme mode
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(248,96,177,0.1)',
        
        
      }}>
    <form onSubmit={formik.handleSubmit}>
      <TextField
        id="question"
        name="question"
        label="What question do you have?"
        value={formik.values.question}
        onChange={formik.handleChange}
        fullWidth
        color="info" 
        style={{ marginBottom: 8, borderRadius: '4px', color: "secondary" }}
      />
      <TextField
        id="action"
        name="action"
        label="What action could you take if you could answer this question?"
        value={formik.values.action}
        onChange={formik.handleChange}
        fullWidth
        color="info" 
        style={{ marginBottom: 8, borderRadius: '4px' }}
      />
      <TextField
        id="name"
        name="name"
        label="Your name"
        value={formik.values.name}
        onChange={formik.handleChange}
        fullWidth
        color="info" 
        style={{ marginBottom: 8, borderRadius: '4px' }}
      />
      <TextField
        id="email"
        name="email"
        label="Contact email (should you want to be contacted about this question)"
        value={formik.values.email}
        onChange={formik.handleChange}
        fullWidth
        color="info" 
        style={{ marginBottom: 8, borderRadius: '4px' }}
      />
      <TextField
        id="organisation"
        name="organisation"
        label="Organisation (if application)"
        value={formik.values.organsiation}
        onChange={formik.handleChange}
        fullWidth
        color="info" 
        style={{ marginBottom: 8, borderRadius: '4px', }}
      />
      
      
      <Button type="submit" variant="contained" color="primary" text style={{ borderRadius: '20px', fontFamily: 'Roboto' }}>
          Submit
        </Button>
    </form>
   
    </Container>
    
     {similarQuestions.length > 0 && (
        <Container style={{ marginTop: '20px'}}>
          <Typography variant="h5" component="h2" style={{ marginBottom: '20px' }}>
            Below are Questions that have been submitted that are similar to yours:
          </Typography>
          <Grid container spacing={2}>
            
            {currentQuestions.map((q) => (
              <Grid item xs={12} sm={6} md={4} key={q.id}>
                <Card className="" variant="outlined" style={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.1)', borderRadius: '20px' }}>
                  <CardContent>
                    <Typography className="questions" variant="h6" component="p" color="primary" >
                      {q.question}
                    </Typography>
                    <Typography component="span" color="text"> {/* Placeholder text color */}
                      Action: 
                    </Typography>
                    <Typography component="span" color="textSecondary"> {/* Value text color */}
                      {q.action}
                    </Typography>
                    <Typography color="text">
                      Submitted by: {q.name}
                    </Typography>
                    <Typography color="text">
                        Organisation:{q.organisation}
                    </Typography>
                    <IconButton onClick={() => handleUpvote(q.id)} color="primary">
                      {upvotedQuestions.includes(q.id)  ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                    {q.priority || 0} {/* Display the current priority */}
                  </CardContent>
                  
                  <CardActions>
                  <Box display="flex" justifyContent="space-between" width="100%" >
 
                    <Button variant="outlined"  color="primary" text style={{ borderRadius: '20px' }} >Add resource</Button>
                    <Button variant="outlined"  color="secondary" text style={{ borderRadius: '20px' }}>Contact</Button>
                    </Box>
                  </CardActions>
                  <CardActions>
                    
                  </CardActions>

                </Card>
              </Grid>
            ))}
          </Grid>
          <Pagination
            count={Math.ceil(totalQuestions / itemsPerPage)}
            page={currentPage}
            onChange={paginate}
            color="primary"
            style={{ marginTop: '20px' }}
          />
        </Container>
      )}
    </>
    
  );
}

export default QuestionForm;

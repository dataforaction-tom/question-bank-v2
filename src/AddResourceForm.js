// AddResourceForm.js
import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, TextField, Button, IconButton, Container, Box } from '@mui/material';
import { useFormik } from 'formik';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useTheme } from '@mui/material/styles';


function AddResourceForm({ question, onSubmit }) {
  const theme = useTheme(); // Using the useTheme hook to access the current theme for materialUI
  const formik = useFormik({
    initialValues: {
      currentProgress: '',
      comment: '',
      csvFile: null,
    },
    onSubmit: (values) => {
      onSubmit(values); // Placeholder for your submit function
    },
  });

  const [upvotedQuestions, setUpvotedQuestions] = useState([]); 
  return (
    <Container maxWidth="lg" style={{
      backgroundColor: theme.palette.mode === 'light' ? '#f4f4f4' : theme.palette.background.default, // Adjusting the background color based on the theme mode
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0px 4px 12px rgba(248,96,177,0.1)',
      marginTop:'20px',
      
      
    }}>
      <Box>
      <h1 className="center"> Add a resource to this question</h1>

      </Box>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        {/* Display the question card */}
        <Card className="" variant="outlined" style={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.1)', borderRadius: '20px' }}>
          <CardContent>
            <Typography variant="h6">{question.question}</Typography>
            <Typography component="span" color="text"> {/* Placeholder text color */}
                      Action: 
                    </Typography>
                    <Typography component="span" color="textSecondary"> {/* Value text color */}
                      {question.action}
                    </Typography>
                    <Typography color="text">
                      Submitted by: {question.name}
                    </Typography>
                    <Typography color="text">
                        Organisation:{question.organisation}
                    </Typography>
                    <IconButton  color="primary">
                      {upvotedQuestions.includes(question.id)  ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                    {question.priority || 0} {/* Display the current priority */}
            {/* Add more question details if needed */}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        {/* Formik form for adding a resource */}
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="currentProgress"
            name="currentProgress"
            label="Current Progress"
            value={formik.values.currentProgress}
            onChange={formik.handleChange}
            margin="normal"
            color="info" 
            style={{ marginBottom: 8, borderRadius: '4px', color: "secondary" }}
          />
          <TextField
            fullWidth
            id="comment"
            name="comment"
            label="Comment"
            value={formik.values.comment}
            onChange={formik.handleChange}
            margin="normal"
          />
          <input
            id="csvFile"
            name="csvFile"
            type="file"
            onChange={(event) => formik.setFieldValue("csvFile", event.currentTarget.files[0])}
            style={{ margin: "20px 0" }}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Grid>
    </Grid>
    </Container>
  );
}

export default AddResourceForm;

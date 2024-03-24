import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Box, TextField, Button, MenuItem, Typography,  } from '@mui/material';

const CreateLeagueForm = () => {
  const initialValues = {
    leagueName: '',
    dayOfWeek: 'Thursday',
    time: '6pm - 9pm',
    teamComposition: '2 players',
    skillLevel: '',
    participationFee: '',
  };

  const validationSchema = Yup.object({
    leagueName: Yup.string().required('Required'),
    dayOfWeek: Yup.string().required('Required'),
    time: Yup.string().required('Required'),
    teamComposition: Yup.string().required('Required'),
    skillLevel: Yup.string().required('Required').matches(/^\d+(\.\d+)?$/, 'Must be a number'),
    participationFee: Yup.number().required('Required').positive('Must be positive'),
  });

//   const onSubmit = (values, { setSubmitting }) => {
//     console.log(values);
//     setSubmitting(false);
//     // Here you would typically make an API call to your server to create the league
//   };

const onSubmit = (values, { setSubmitting, resetForm }) => {
    fetch('/api/leagues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
    .then(response => response.json())
    .then(data => {
      console.log('League created:', data);
      setSubmitting(false);
      resetForm();
    })
    .catch(error => {
      console.error('There was an error creating the league:', error);
      setSubmitting(false);
    });
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 4, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create League
      </Typography>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ errors, touched, handleChange, handleBlur, values, isSubmitting }) => (
          <Form>
            <TextField
              label="League Name"
              name="leagueName"
              value={values.leagueName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.leagueName && Boolean(errors.leagueName)}
              helperText={touched.leagueName && errors.leagueName}
              margin="normal"
              fullWidth
            />

            <TextField
              select
              label="Day of Week"
              name="dayOfWeek"
              value={values.dayOfWeek}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.dayOfWeek && Boolean(errors.dayOfWeek)}
              helperText={touched.dayOfWeek && errors.dayOfWeek}
              margin="normal"
              fullWidth
            >
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Time"
              name="time"
              value={values.time}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.time && Boolean(errors.time)}
              helperText={touched.time && errors.time}
              margin="normal"
              fullWidth
            />

            <TextField
              label="Team Composition"
              name="teamComposition"
              value={values.teamComposition}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.teamComposition && Boolean(errors.teamComposition)}
              helperText={touched.teamComposition && errors.teamComposition}
              margin="normal"
              fullWidth
            />

            <TextField
              label="Skill Level"
              name="skillLevel"
              value={values.skillLevel}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.skillLevel && Boolean(errors.skillLevel)}
              helperText={touched.skillLevel && errors.skillLevel}
              margin="normal"
              fullWidth
            />

            <TextField
              label="Participation Fee ($)"
              name="participationFee"
              type="number"
              value={values.participationFee}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.participationFee && Boolean(errors.participationFee)}
              helperText={touched.participationFee && errors.participationFee}
              margin="normal"
              fullWidth
            />

            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} sx={{ mt: 2 }}>
              Create League
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateLeagueForm;

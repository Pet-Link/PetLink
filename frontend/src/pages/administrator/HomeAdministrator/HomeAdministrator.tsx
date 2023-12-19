import React, { useState } from 'react';
import {
    Container,
    Typography,
    Grid,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
//import './styles.css';

const HomeAdministrator = () => {
    const navigate = useNavigate();

    return (
        <Box m={2} pt={3}>
        <Container >
            <Typography variant="h4" align="center" gutterBottom>
                Administrators, your actions make a difference.{' '}<br/>
                <span style={{ color: 'red', fontWeight: 'bold'}}> Evaluate, update, and oversee</span>  for happier, healthier pets!
            </Typography>
        </Container>

            <Grid container justifyContent="center" spacing={2} style={{ marginTop: 150 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                        width: '200px',
                        height: '170px',
                        textTransform: 'none',
                        marginBottom: 2,
                        color: 'black',       // Set text color to black
                        fontWeight: 'bold',   // Make the text bold
                        fontSize: '1.2rem',    // Set the font size to 1.2rem (adjust as needed)
                        mr:10,
                        '&:hover': {
                            color : 'white',
                            transform: 'scale(1.1)',
                        },
                    }}
                    onClick={() => {
                        navigate('/administrator/view-applications');
                    }}
                >
                    View Applications
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                        width: '200px',
                        height: '170px',
                        textTransform: 'none',
                        marginBottom: 2,
                        color: 'black',       // Set text color to black
                        fontWeight: 'bold',   // Make the text bold
                        fontSize: '1.2rem',    // Set the font size to 1.2rem (adjust as needed)
                        mr:10,
                        '&:hover': {
                            color : 'white',
                            transform: 'scale(1.1)',
                        },
                    }}
                    onClick={() => {
                        // Handle click action
                        // You can add your logic here
                    }}
                >
                    View Registrations
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                        width: '200px',
                        height: '170px',
                        textTransform: 'none',
                        marginBottom: 2,
                        color: 'black',       // Set text color to black
                        fontWeight: 'bold',   // Make the text bold
                        fontSize: '1.2rem',    // Set the font size to 1.2rem (adjust as needed)
                        mr:10,
                        '&:hover': {
                            color : 'white',
                            transform: 'scale(1.1)',
                        },
                    }}
                    onClick={() => {
                        // Handle click action
                        // You can add your logic here
                    }}
                >
                    Oversee Records
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                        width: '200px',
                        height: '170px',
                        textTransform: 'none',
                        marginBottom: 2,
                        color: 'black',       // Set text color to black
                        fontWeight: 'bold',   // Make the text bold
                        fontSize: '1.2rem',    // Set the font size to 1.2rem (adjust as needed)
                        '&:hover': {
                            color : 'white',
                            transform: 'scale(1.1)',
                        },
                    }}
                    onClick={() => {
                        // Handle click action
                        // You can add your logic here
                    }}
                >
                    Add General Pet Care Information
                </Button>
            </Grid>

        </Box>
    );
};

export default HomeAdministrator;

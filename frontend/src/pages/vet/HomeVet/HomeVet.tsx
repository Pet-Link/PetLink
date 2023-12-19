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

const HomeVet = () => {
    const navigate = useNavigate();

    return (
        <Box m={2} pt={3}>
            <Container >
                <Typography variant="h4" align="center" gutterBottom>
                    Veterinarians, your decisions impact the well-being of countless animals.{' '}<br/>
                    <span style={{ color: 'red', fontWeight: 'bold'}}>Assess, enhance, and supervise</span> for the happiness and health of our beloved pets!
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
                        backgroundColor: '#FF0000',  // Set the background color to red
                        '&:hover': {
                            color : 'white',
                            backgroundColor: '#FF0000',  // Set the background color to red
                            transform: 'scale(1.1)',
                        },
                    }}
                    onClick={() => {
                        navigate('/veterinarian/see-appointments');
                    }}
                >
                    See Appointments
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
                        backgroundColor: '#FF0000',  // Set the background color to red
                        '&:hover': {
                            color : 'white',
                            backgroundColor: '#FF0000',  // Set the background color to red
                            transform: 'scale(1.1)',
                        },
                    }}
                    onClick={() => {
                        navigate('/veterinarian/log-medical-details');
                    }}
                >
                    Log Medical Details
                </Button>

            </Grid>

        </Box>
    );
};

export default HomeVet;

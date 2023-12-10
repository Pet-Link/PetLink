import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';

const PetDetailsPage = () => {
    const inputStyle = { marginBottom: '10px' };

    return (
        <Grid container spacing={2} style={{ marginTop:"50px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Dog Image */}
            <Grid item xs={12}>
                <Typography variant="h4" align="center" gutterBottom>
                    Photo of the Pet:
                </Typography>
                <img
                    src={`./HomePageAnimals/dog-1.png`}
                    style={{ width: '350px', height: 'auto' }}
                />
            </Grid>

            {/* Left Side */}
            <Grid item xs={6}>
                {/* Shelter */}
                <TextField
                    label="Shelter"
                    fullWidth
                    value="Happy Homes"
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* Name */}
                <TextField
                    label="Name"
                    fullWidth
                    value="Luna"
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* Breed - Species */}
                <TextField
                    label="Breed - Species"
                    fullWidth
                    value="Labradoodle - Dog"
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* Age */}
                <TextField
                    label="Age"
                    fullWidth
                    value="1 years old"
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* Sex */}
                <TextField
                    label="Sex"
                    fullWidth
                    value="Female"
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* Neuter Status */}
                <TextField
                    label="Neuter Status"
                    fullWidth
                    value="Neutered"
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* House Trained */}
                <TextField
                    label="House Trained?"
                    fullWidth
                    value="Yes"
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* Fully Vaccinated */}
                <TextField
                    label="Fully Vaccinated"
                    fullWidth
                    value="Yes"
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* Adoption Fee */}
                <TextField
                    label="Adoption Fee"
                    fullWidth
                    value="$300"
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* Details */}
                <TextField
                    label="Details"
                    multiline
                    rows={4}
                    fullWidth
                    value="Luna is a very friendly dog. She loves little kids."
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />
            </Grid>

            {/* Right Side */}
            <Grid item xs={6}>
                <Grid container spacing={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>


                    {/* Calendar */}
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker />
                        </LocalizationProvider>
                    </Grid>

                    {/* Apply For Adoption Button */}
                    <Grid item xs={12} style={{ marginTop: '20px' }}>
                        <Button variant="contained" color="secondary">
                            Apply For Adoption
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default PetDetailsPage;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import petModel from '../../models/petModel';
import { PetService } from '../../services/petService';
import dayjs from 'dayjs';
import toastr from 'toastr';

const PetOfAdopterDetail = () => {
    const inputStyle = { marginBottom: '10px' };
    const location = useLocation();

    const {pet_ID} = location.state || {};

    const [pet, setPet] = useState<petModel>();
    const [petName, setPetName] = useState("");

    const fetchPet = async () => {
        try {
            const response = await PetService.getDetailsOfAdopterPet(pet_ID);
            if (!response.ok) {
                console.error("There was a network error while getting pets by ID.");
                toastr.error("There was a network error.");
            }
            const data: petModel = await response.json();
            setPet(data);
            setPetName(data.name);
        } catch (error) {
            console.error("There was an error fetching the applications:", error);
            toastr.error("There was an internal error fetching the applications.");
        }
    };


    useEffect(() => {
        fetchPet();
    }, []);

    return (
        <Grid container spacing={2} style={{ marginTop:"50px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Dog Image */}
            <Grid item xs={12}>
                <Typography variant="h4" align="center" gutterBottom>
                    Photo of the Pet:
                </Typography>
                <img
                    src="https://media.istockphoto.com/id/144804780/photo/dog-with-tennis-ball.jpg?s=612x612&w=0&k=20&c=7ES0wGFEMpZmU-Jax4YyrKywOJ7kFkDotHrcicxiIsM="
                    style={{ width: '350px', height: 'auto', borderRadius: 15}}
                />
            </Grid>

            {/* Left Side */}
            <Grid item xs={6}>
                {/* Shelter */}
                {/* <TextField
                    label="Shelter"
                    fullWidth
                    value={pet?.shelter_name || 'unknown'}
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                /> */}

                {/* Name */}
                <TextField
                    label="Name"    
                    fullWidth
                    value={pet?.name || 'unknown'}
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* Breed - Species */}
                <TextField
                    label="Breed - Species"
                    fullWidth
                    value={`${pet?.breed || 'unknown'} - ${pet?.species || 'unknown'}`}
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* Age */}
                <TextField
                    label="Age"
                    fullWidth
                    value={`${pet?.age || 'unknown'} years old`}
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* Sex */}
                <TextField
                    label="Sex"
                    fullWidth
                    value={pet?.sex || 'unknown'}
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* Neuter Status */}
                <TextField
                    label="Neutered?"
                    fullWidth
                    value={pet?.neutered_status ? 'Yes' : pet?.neutered_status == false ? 'No' : 'Unknown'}
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* House Trained */}
                <TextField
                    label="House Trained?"
                    fullWidth
                    value={pet?.house_trained_status ? 'Yes' : pet?.house_trained_status == false ? 'No' : 'Unknown'}
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* Fully Vaccinated */}
                <TextField
                    label="Fully Vaccinated"
                    fullWidth
                    value={pet?.vaccination_status ? 'Yes' : pet?.house_trained_status == false ? 'No' : 'Unknown'}
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />

                {/* Adoption Fee */}
                {/* <TextField
                    label="Adoption Fee"
                    fullWidth
                    value={pet?.adoption_fee || 'unknown'}
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                /> */}

                {/* Details */}
                <TextField
                    label="Details"
                    multiline
                    rows={4}
                    fullWidth
                    value={pet?.description || ' '}
                    InputProps={{ readOnly: true }}
                    style={inputStyle}
                />
            </Grid>

            {/* Right Side */}
            <Grid item xs={6}>
                <Grid container spacing={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>


                    {/* Calendar */}
                    {/* <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                             <DatePicker
                                label="Schedule Meet & Greet"
                                value={meetGreetDate}
                                onChange={handleMeetDateChange}
                                
                            />
                        </LocalizationProvider>

                        <Button variant="contained" color="secondary" onClick={handleScheduleMeetGreet} style={{height: 50,marginLeft:15, marginTop:2.5}}>
                            Arrange Meet&Greet
                        </Button>
                    </Grid> */}

                    {/* Apply For Adoption Button */}
                    {/* <Grid item xs={12} style={{ marginTop: '10px' }}>
                        <Button variant="contained" color="primary" onClick={handleApply} sx={{height: 50, bgcolor: '#04C35C',}}>
                            Apply For Adoption
                        </Button>
                    </Grid> */}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default PetOfAdopterDetail;

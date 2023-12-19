import React, { useState } from 'react';
import { Card, Button, Modal, Select, Grid, TextField, Typography, Box } from '@mui/material'; 
import { DatePicker } from '@mui/x-date-pickers'; 
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const filterStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000000', // Change the border color to red
    borderRadius: 10, // Adjust the border radius for a rounder appearance
    boxShadow: 24,
    p: 4,
    buttonColor: '#FF0000', // Color for the button
};


const ViewVets = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPet, setSelectedPet] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const veterinarians = [
        {
            id: 1,
            name: 'John Doe',
            year_of_experience: 5,
            speciality: 'Dogs',
            street: '123 Main Street',
            district: 'Downtown',
            apartment_no: '1',
            city: 'Toronto',
            zip: 'M1M 1M1',
            country: 'Canada'
        },
        {
            id: 2,
            name: 'Jane Doe',
            year_of_experience: 10,
            speciality: 'Cats',
            street: '123 Main Street',
            district: 'Downtown',
            apartment_no: '1',
            city: 'Toronto',
            zip: 'M1M 1M1',
            country: 'Canada'
        },
        // Add more veterinarians here
    ];

    const handleSearch = () => {
        //search logic
    };

    const handleScheduleAppointment = () => {
        setIsModalOpen(true);
    };

    const handleArrangeAppointment = () => {
        //set appointment logic
        setIsModalOpen(false);
    };

    return (    
        <Grid container 
            sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 10, 
            mb: 5
        }}>
            <Grid item 
                sx={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '50%',
            }}>
                <TextField  value={searchQuery} label="Search vet..." variant="outlined" onChange={(e) => setSearchQuery(e.target.value)} fullWidth />
                <Button sx={{mt:5, mb:5}} variant="contained" onClick={handleSearch}>Search</Button>
            </Grid>

            {veterinarians.map((veterinarian) => (
                <Grid item sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} key={veterinarian.id}>
                    <Card sx={{p:2, width: '100%', mb: 5}}>
                        <Typography >Name:{veterinarian.name}</Typography>
                        <Typography >Years of Experience:{veterinarian.year_of_experience}</Typography>
                        <Typography >Speciality:{veterinarian.speciality}</Typography>
                        <Typography >Address: Apt-no:{veterinarian.apartment_no}, {veterinarian.street}, {veterinarian.district}, {veterinarian.city}</Typography>
                        <Button variant="contained" onClick={() => handleScheduleAppointment()}>Schedule an Appointment</Button>
                    </Card>
                </Grid>
            ))}

            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box sx={filterStyle}>
                    <Typography variant="h4" gutterBottom> Schedule an Appointment </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom> Select a Pet </Typography>
                            <Select value={selectedPet} sx={{width: '15vw'}} onChange={(e) => setSelectedPet(e.target.value)}>
                                {/* Render the options for selecting a pet */}
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom> Select a Date </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={handleArrangeAppointment}>Arrange</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </Grid>
       
    );
};

export default ViewVets;

/*
year_of_experience: number;
    speciality: string;
    street: string;
    district: string;
    apartment_no: string;
    city: string;
    zip: string;
    country: string;*/
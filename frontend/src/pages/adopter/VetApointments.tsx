import React, { useState, useEffect } from 'react';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TextField,
    Button,
    Grid,
    Typography,
    Modal
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import toastr from 'toastr';
import { AppointmentService } from '../../services/appointmentService';
import appointmentModel from '../../models/appointmentModel';

const VetAppointments = () => {
    const [appointments, setAppointments] = useState<appointmentModel[]>([]);
    const [searchVet, setSearchVet] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAppointments = async () => {
        try {
            const adopter_ID = parseInt(localStorage.getItem("user_ID") || "0");
            const response = await AppointmentService.getAllAppointmentsOfAdopter(adopter_ID);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data: appointmentModel[] = await response.json(); 
            setAppointments(data);
        } catch (error) {
            console.error("There was an error while fetching the applications:", error);
            toastr.error("There was an internal error while fetching the applications.");
        }
    };


    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    }
    
    // Function to handle searching for a vet
    const handleSearchVet = () => {
        // Perform search logic here
        // Update appointments state with the search results
    };

    // Function to handle scheduling an appointment
    const handleScheduleAppointment = (newDate: Date | null) => {
        // Perform scheduling logic here
        // Update appointments state with the new appointment
        setSelectedDate(newDate);
    };

    const handleArrangeClick = () => {
        // Send arrangement information to the backend
        // Close the modal
        setIsModalOpen(false);
    };

    const handleDeleteAppointment = (veterinarian_ID: number, veterinarian_name?: string) => {
        const adopter_ID = parseInt(localStorage.getItem("user_ID") || "0");
        AppointmentService.deleteAppointment(veterinarian_ID, adopter_ID).then((response) => {
            if (response.ok) {
                const successMessage = veterinarian_name
                ? `Appointment for ${veterinarian_name} is successfully deleted.`
                : 'Appointment is successfully deleted.';
                toastr.success(successMessage);
                fetchAppointments();
            } else {
                response.text().then((text) => {
                    try {
                        toastr.error("Failed to delete appointment.");
                        console.error(text);
                    } catch (error) {
                        console.error('Invalid JSON:', text);
                    }
                });
            }
        }
        );

    };

    return (
        <Grid container sx={{ 
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 10, 
            mb: 5
        }}>
            <Grid item sx={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                mt:5,
                mr:20
            }}>
                <Typography variant="h5" gutterBottom>
                    Schedule Appointments
                </Typography>
                <TextField
                    type="text"
                    value={searchVet}
                    onChange={(e) => setSearchVet(e.target.value)}
                    placeholder="Search Vet"
                    sx={{width:'20vw'}}
                />
                <Button sx={{mt:2}} variant="contained" onClick={handleSearchVet}>
                    Search
                </Button>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Vet ID</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Speciality</TableCell>
                            <TableCell>Years Of Experience</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/*vets.map((vet) => (
                            <TableRow key={appointment.id}>
                                <TableCell>{vet.user_ID}</TableCell>
                                <TableCell>{vet.street + ' ' + vet.district + ' ' + vet.city}</TableCell>
                                <TableCell>{vet.speciality}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={handleModalOpen}
                                    >
                                        Schedule
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))*/}
                    </TableBody>
                </Table>
            </Grid>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Grid container sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 10, 
                    mb: 5,
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '5px'
                }}>
                    <Typography variant="h5" gutterBottom>
                        Choose a Date
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Schedule Meet & Greet"
                            value={selectedDate}
                            onChange={handleScheduleAppointment}
                        />
                    </LocalizationProvider>
                    <Button sx={{mt:2}} variant="contained" onClick={handleArrangeClick}>
                        Arrange
                    </Button>
                </Grid>
            </Modal>

            <Grid item sx={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Typography variant="h5" gutterBottom>
                    My Vet Appointments
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Veterinarian Name</TableCell>
                            <TableCell>Pet Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments.map((appointment, index) => (
                            <TableRow key={index}>
                                <TableCell>{appointment.veterinarian_name}</TableCell>
                                <TableCell>{appointment.pet_name}</TableCell>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{ backgroundColor: "red" }}
                                        onClick={() => handleDeleteAppointment(appointment.veterinarian_ID, appointment.veterinarian_name)}
                                    >Delete</Button>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Grid>
        </Grid>
    );
};

export default VetAppointments;
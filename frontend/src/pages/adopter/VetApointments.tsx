import React, { useState } from 'react';
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

const VetAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [searchVet, setSearchVet] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                            <TableCell>Vet Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Speciality</TableCell>
                            <TableCell>Years Of Experience</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/*appointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                                <TableCell>{appointment.vetName}</TableCell>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>{appointment.time}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleScheduleAppointment(appointment.vetId)}
                                    >
                                        Schedule
                                    </Button>
                                </TableCell>
                                <TableCell><Button>Schedule Appointment</Button></TableCell>
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
                            <TableCell>Vet Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/*appointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                                <TableCell>{appointment.vetName}</TableCell>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>{appointment.time}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleScheduleAppointment(appointment.vetId)}
                                    >
                                        Schedule
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))*/}
                    </TableBody>
                </Table>
            </Grid>
        </Grid>
    );
};

export default VetAppointments;
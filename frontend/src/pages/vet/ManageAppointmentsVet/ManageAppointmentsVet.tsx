import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Box,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
} from '@mui/material';
import appointmentModel from "../../../models/appointment";
import { VeterinarianService } from '../../../services/veterinarianService';
import toastr from 'toastr';
import { PetService } from '../../../services/petService';
import petModel from '../../../models/petModel';
import { UserService } from '../../../services/userService';
import userModel from '../../../models/userModel';
import { useNavigate } from 'react-router';
import HomeIcon from '@mui/icons-material/Home';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AppointmentService } from '../../../services/appointmentService';
import { format } from 'date-fns';

const ManageAppointmentsVet: React.FC = () => {
    const [rescheduleData, setRescheduleData] = useState({ open: false, appointment: null as appointmentModel | null });
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<appointmentModel[]>([
        // { adopter_ID: 1, veterinarian_ID: 1, date: new Date('2023-05-01'), approval_status: null, details: 'Appointment 1' },
        // { adopter_ID: 2, veterinarian_ID: 1, date: new Date('2023-05-02'), approval_status: null, details: 'Appointment 2' },
        // // Add more sample appointments as needed
    ]);

    // State for managing selected date and time
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

    // Function to handle the change of date and time
    const handleDateTimeChange = (newDateTime: Date | null) => {
        setSelectedDateTime(newDateTime);
    };

    const fetchAppointments = async () => {
        const user_ID = localStorage.getItem('user_ID');
        if (user_ID != null) {
            try {
                const response = await VeterinarianService.getAllAppointmentsOfVeterinarian(user_ID);
                const data = await response.json();
                const updatedAppointments = [];
    
                for (const appointment of data) {
                    if (appointment.pet_ID != null && appointment.pet_ID !== undefined) {
                        try {
                            const petResponse = await PetService.getPetById(appointment.pet_ID.toString());
                            const petData = await petResponse.json();
                            appointment.pet_breed = petData.breed;
                            appointment.pet_species = petData.species;
                        } catch (error) {
                            console.error('Error fetching pet:', error);
                        }
    
                        try {
                            const userResponse = await UserService.getUserById(appointment.adopter_ID.toString());
                            const userData = await userResponse.json();
                            appointment.adopter_name = userData.name;
                        } catch (error) {
                            console.error('Error fetching user:', error);
                        }
                    }
    
                    appointment.date = new Date(appointment.date);
                    updatedAppointments.push(appointment);
                }
    
                setAppointments(updatedAppointments);
                toastr.success("Appointments fetched successfully!");
            } catch (error) {
                console.error('Error fetching appointments:', error);
                toastr.error("Error fetching appointments!");
            }
        } else {
            toastr.error("Please login first!");
        }
    };
    

    const handleConfirm = (adopter_ID: number) => {
        // get the veterinarian_ID from localStorage
        const veterinarian_ID = localStorage.getItem('user_ID');
        if (veterinarian_ID != null) {
            VeterinarianService.approveAppointment(veterinarian_ID, adopter_ID.toString())
                .then(response => {
                    if (response.ok) {
                        toastr.success("Appointment confirmed successfully!");
                        fetchAppointments();
                    } else {
                        toastr.error("Error confirming appointment!");
                    }
                })
                .catch(error => {
                    console.error('Error confirming appointment:', error);
                    toastr.error("Error confirming appointment!");
                });
        }
        const updatedAppointments = appointments.map(appointment => {
             if (appointment.adopter_ID === adopter_ID) {
                 return { ...appointment, approval_status: true };
             }
             return appointment;
         });
        setAppointments(updatedAppointments);
    };

    const handleReject = (adopter_ID: number) => {
        // get the veterinarian_ID from localStorage
        const veterinarian_ID = localStorage.getItem('user_ID');
        if (veterinarian_ID != null) {
            VeterinarianService.rejectAppointment(veterinarian_ID, adopter_ID.toString())
                .then(response => {
                    if (response.ok) {
                        toastr.success("Appointment rejected successfully!");
                        fetchAppointments();
                    } else {
                        toastr.error("Error rejecting appointment!");
                    }
                })
                .catch(error => {
                    console.error('Error rejecting appointment:', error);
                    toastr.error("Error rejecting appointment!");
                });
        }

        const updatedAppointments = appointments.map(appointment => {
            if (appointment.adopter_ID === adopter_ID) {
                return { ...appointment, approval_status: false };
            }
            return appointment;
        });
        setAppointments(updatedAppointments);
    };

    const handleDelete = (adopter_ID: number) => {
        // get the veterinarian_ID from localStorage
        const veterinarian_ID = localStorage.getItem('user_ID');
        if (veterinarian_ID != null) {
            VeterinarianService.deleteApointment(veterinarian_ID, adopter_ID.toString())
                .then(response => {
                    if (response.ok) {
                        toastr.success("Appointment deleted successfully!");
                        fetchAppointments();
                    } else {
                        toastr.error("Error deleting appointment!");
                    }
                })
                .catch(error => {
                    toastr.error("Error deleting appointment!");
                });
        }
    };

    // Function to handle the "Go Back Home" action
    const goBackHome = () => {
        navigate('/veterinarian/home');
    };

    // Function to open the reschedule pop-up
    const handleOpenReschedule = (appointment: appointmentModel) => {
        setRescheduleData({ open: true, appointment });
    };

    // Update the reschedule function to use the selected date and time
    const handleReschedule = () => {
        if (rescheduleData.appointment && selectedDateTime) {
            const formattedDateTime = format(selectedDateTime, 'yyyy-MM-dd HH:mm:ss');
            rescheduleData.appointment.date = formattedDateTime;
            console.log(rescheduleData.appointment.date) 
            AppointmentService.updateAppointment(rescheduleData.appointment).then(response => {
                if (response.ok) {
                    toastr.success("Appointment rescheduled successfully!");
                    fetchAppointments();
                } else {
                    toastr.error("Error rescheduling appointment!");
                }
            }
            ).catch(error => {
                console.error('Error rescheduling appointment:', error);
                toastr.error("Error rescheduling appointment!");
            });
            console.log(rescheduleData.appointment)
            console.log("Rescheduling appointment to", selectedDateTime);

            // Close the pop-up after rescheduling
            setRescheduleData({ ...rescheduleData, open: false });
        }
    };

    return (
        <Container>
            <Dialog open={rescheduleData.open} onClose={() => setRescheduleData({ ...rescheduleData, open: false })}>
                <DialogTitle>Reschedule Appointment</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Reschedule Date & Time"
                            value={selectedDateTime}
                            onChange={handleDateTimeChange}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRescheduleData({ ...rescheduleData, open: false })}>Cancel</Button>
                    <Button onClick={handleReschedule}>Reschedule</Button>
                </DialogActions>
            </Dialog>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h4" gutterBottom>
                        Manage Appointments
                    </Typography>
                </Grid>
                <Grid item>
                    <IconButton onClick={goBackHome}>
                        <HomeIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Button variant="contained" color="primary" onClick={fetchAppointments}>
                Fetch Appointments
            </Button>
            <Grid container justifyContent="center" spacing={2} style={{ marginTop: 20 }}>
                <TableContainer component={Box}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Adopter Name</TableCell>
                                <TableCell>Pet Breed</TableCell>
                                <TableCell>Pet Species</TableCell>
                                <TableCell>Details</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.map(appointment => (
                                <TableRow key={appointment.adopter_ID}>
                                    <TableCell>{appointment.adopter_name}</TableCell>
                                    <TableCell>{appointment.pet_breed}</TableCell>
                                    <TableCell>{appointment.pet_species}</TableCell>
                                    <TableCell>{appointment.details}</TableCell>
                                    <TableCell>{appointment.date.toString()}</TableCell>
                                    <TableCell>
                                        {appointment.approval_status === null
                                            ? 'Pending'
                                            : appointment.approval_status
                                                ? 'Confirmed'
                                                : 'Rejected'}
                                    </TableCell>
                                    <TableCell>
                                        {appointment.approval_status == null && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleConfirm(appointment.adopter_ID)}
                                                >
                                                    Confirm
                                                </Button>
                                                <Button sx={{ marginLeft: 2 }}
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => handleReject(appointment.adopter_ID)}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{ backgroundColor: "red" }}
                                        onClick={() => handleDelete(appointment.adopter_ID)}
                                    >
                                        Delete
                                    </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="inherit"
                                            onClick={() => handleOpenReschedule(appointment)}
                                        >
                                            Reschedule
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Container>
    );
};

export default ManageAppointmentsVet;

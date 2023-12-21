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
import appointmentModel from "../../../models/appointmentModel";
import { VeterinarianService } from '../../../services/veterinarianService';
import toastr from 'toastr';
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

const ManageAppointmentsVet: React.FC = () => {
    const [rescheduleData, setRescheduleData] = useState({ open: false, appointment: null as appointmentModel | null });
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<appointmentModel[]>([]);

    // State for managing selected date and time
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

    // Function to handle the change of date and time
    const handleDateTimeChange = (newDateTime: Date | null) => {
        setSelectedDateTime(newDateTime);
    };

    // NOTE: this is the format that MySQL expects
    const formatDateToMySQL = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const fetchAppointments = async () => {
        
        try {
            const response = await VeterinarianService.getAllAppointmentsOfVeterinarian();
            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            toastr.error("Error fetching appointments!");
        }
        
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

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
            const formattedDateTime = formatDateToMySQL(selectedDateTime);
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
                    <Typography variant="h4"  sx={{ padding: 2, mt: 5 }}gutterBottom>
                        Manage Appointments
                    </Typography>
                </Grid>
                <Grid item>
                    <IconButton onClick={goBackHome}>
                        <HomeIcon />
                    </IconButton>
                </Grid>
            </Grid>
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

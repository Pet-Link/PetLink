import React, { useState } from 'react';
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
} from '@mui/material';
import appointmentModel from "../../../models/appointment";

const ManageAppointmentsVet: React.FC = () => {
    // TODO: Fetch the appointment list, I put dummy info to see ui here
    const [appointments, setAppointments] = useState<appointmentModel[]>([
        { adopter_ID: 1, veterinarian_ID: 1, date: new Date('2023-05-01'), approval_status: null, details: 'Appointment 1' },
        { adopter_ID: 2, veterinarian_ID: 1, date: new Date('2023-05-02'), approval_status: null, details: 'Appointment 2' },
        // Add more sample appointments as needed
    ]);

    const handleConfirm = (adopter_ID: number) => {
        const updatedAppointments = appointments.map(appointment => {
            if (appointment.adopter_ID === adopter_ID) {
                return { ...appointment, approval_status: true };
            }
            return appointment;
        });
        setAppointments(updatedAppointments);
    };

    const handleReject = (adopter_ID: number) => {
        const updatedAppointments = appointments.map(appointment => {
            if (appointment.adopter_ID === adopter_ID) {
                return { ...appointment, approval_status: false };
            }
            return appointment;
        });
        setAppointments(updatedAppointments);
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Manage Appointments
            </Typography>
            <Grid container justifyContent="center" spacing={2} style={{ marginTop: 20 }}>
                <TableContainer component={Box}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.map(appointment => (
                                <TableRow key={appointment.adopter_ID}>
                                    <TableCell>{appointment.date.toDateString()}</TableCell>
                                    {/* Assume time is not part of your model */}
                                    <TableCell>{appointment.date.toLocaleTimeString()}</TableCell>
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

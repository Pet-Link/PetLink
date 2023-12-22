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
    Modal,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import toastr from 'toastr';
import { AppointmentService } from '../../services/appointmentService';
import appointmentModel from '../../models/appointmentModel';
import { VeterinarianService } from '../../services/veterinarianService';
import veterinarianModel from '../../models/veterinarian';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PetService } from '../../services/petService';
import petModel from '../../models/petModel';

const VetAppointments = () => {
    const [appointments, setAppointments] = useState<appointmentModel[]>([]);
    const [new_appointment_veterinerian_ID, setNewAppointmentVeterinerianID] = useState(0);
    const [veterinarian_name, setVeterinarianName] = useState('');
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [veterinarians, setVeterinarians] = useState<veterinarianModel[]>([]);
    const [appointmentDetails, setAppointmentDetails] = useState('');
    const [pets, setPets] = useState<petModel[]>([]);
    const [selectedPetID, setSelectedPetID] = useState(0);

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

    const fetchAppointmentsAndVets = async () => {
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

        try {
            const response = await VeterinarianService.getVeterinarians();

            if (response.status === 404) {
                setVeterinarians([]);
                response.text().then((text) => {
                    toastr.info(text);
                });
            } else if (!response.ok) {
                throw new Error('Network response was not ok.');
            } else {
                const data: veterinarianModel[] = await response.json(); 
                setVeterinarians(data);
            }  
        } catch (error) {
            console.error("There was an error while fetching all veterinarians:", error);
            toastr.error("There was an internal error while fetching the veterinarians.");
        }
    };


    useEffect(() => {
        fetchAppointmentsAndVets();
    }, []);

    const handleModalOpen = (veterinarian_ID: number) => {
        setNewAppointmentVeterinerianID(veterinarian_ID);
        fetchPets();
        setIsModalOpen(true);
    }
    
    // Function to handle searching for a vet
    const handleSearchVet = async () => {
        try {
            const response = await VeterinarianService.searchVeterinarian(veterinarian_name, null);
            if (response.status === 404) {
                setVeterinarians([]);
                response.text().then((text) => {
                    toastr.info(text);
                });
            } else if (!response.ok) {
                throw new Error('Network response was not ok.');
            } else {
                const data: veterinarianModel[] = await response.json(); 
                setVeterinarians(data);
            }  
        } catch (error) {
            console.error("There was an error while fetching the applications:", error);
            toastr.error("There was an internal error while fetching the veterinarians.");
        }
    };

    // Function to handle scheduling an appointment
    const handleSelectedDateChange = (newDate: Date | null) => {
        setSelectedDateTime(newDate);
    };

    const handlePetIDChange = (event: SelectChangeEvent) => {
        setSelectedPetID(parseInt(event.target.value));
    };

    const handleScheduleAppointment = () => {
        if (parseInt(localStorage.getItem('user_ID') || '0') === 0) {
            toastr.error("You must be logged in to get an appointment.");
            return;
        }
        const adopter_ID = parseInt(localStorage.getItem("user_ID") || "0");

        if (selectedDateTime === null) {
            toastr.error('Choose a date.');
            return;
        }

        if (appointmentDetails === '') {
            toastr.error('Appointment reason must be entered.');
            return;
        }

        if (selectedPetID === 0) {
            toastr.error('Choose a pet.');
            return;
        }


        if (selectedDateTime){
            const newAppointment: appointmentModel = {
                adopter_ID: adopter_ID,
                veterinarian_ID: new_appointment_veterinerian_ID,
                date: formatDateToMySQL(selectedDateTime),
                approval_status: null,
                details: appointmentDetails,
                pet_ID: selectedPetID,
            };
            
            // Send the post object to the backend
            AppointmentService.addAppointment(newAppointment).then(response => {
                if (response.ok) {
                    toastr.success("Appointment created successfully!");
                    fetchAppointmentsAndVets();
                } else {
                    toastr.error("Error creating appointment!");
                }
            }
            ).catch(error => {
                console.error('Error creating appointment:', error);
                toastr.error("Error creating appointment!");
            });
        }
        setIsModalOpen(false);
    };


    const handleDeleteAppointment = (veterinarian_ID: number, veterinarian_name?: string) => {
        const adopter_ID = parseInt(localStorage.getItem("user_ID") || "0");
        AppointmentService.deleteAppointment(veterinarian_ID, adopter_ID).then((response) => {
            if (response.ok) {
                const successMessage = veterinarian_name
                ? `Appointment with veterinarian ${veterinarian_name} is successfully deleted.`
                : 'Appointment is successfully deleted.';
                toastr.success(successMessage);
                fetchAppointmentsAndVets();
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

    const fetchPets = async () => {
        try {
            var user_ID = localStorage.getItem('user_ID');
            if (user_ID !== null) {
                const response = await PetService.getPetsOfaAdopter(user_ID);
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const data: petModel[] = await response.json();
                setPets(data);
            } else {
                toastr.error("Please login first.");
            }
        } catch (error) {
            console.error("There was an error fetching the pets:", error);
            toastr.error("There was an internal error fetching the pets.");
        }
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
                    value={veterinarian_name}
                    onChange={(e) => setVeterinarianName(e.target.value)}
                    placeholder="Search Vet"
                    sx={{width:'20vw'}}
                />
                <Button sx={{mt:2}} variant="contained" onClick={handleSearchVet}>
                    Search
                </Button>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Veterinarian Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Speciality</TableCell>
                            <TableCell>Years Of Experience</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {veterinarians.map((veterinarian) => (
                            <TableRow key={veterinarian.user_ID}>
                                <TableCell>{veterinarian.veterinarian_name}</TableCell>
                                <TableCell>{veterinarian.street + ' ' + veterinarian.district + ' ' + veterinarian.city}</TableCell>
                                <TableCell>{veterinarian.speciality}</TableCell>
                                <TableCell>{veterinarian.year_of_experience}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleModalOpen(veterinarian.user_ID)}
                                    >
                                        Schedule
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
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
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Schedule Appointment"
                            value={selectedDateTime}
                            onChange={handleSelectedDateChange}
                        />
                    </LocalizationProvider>
                    <TextField style={{ width: '60%' }}
                        label="Reason for appointment"
                        value={appointmentDetails}
                        onChange={(e) => setAppointmentDetails(e.target.value)}
                        sx={{ mt: 2, width: '100%' }}
                    />
                    <InputLabel>Pet Name</InputLabel>
                    <Select 
                        value={selectedPetID.toString()}
                        label="Pet Name"
                        onChange={handlePetIDChange}
                    >
                        {pets.map((pet) => (
                            <MenuItem key={pet.pet_ID} value={pet.pet_ID}>
                                {pet.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button sx={{mt:2}} variant="contained" onClick={handleScheduleAppointment}>
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
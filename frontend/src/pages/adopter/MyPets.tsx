import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Grid,
    Card,
    CardContent,
    Select,
    useColorScheme,
    FormControlLabel, RadioGroup, FormLabel, FormControl, Radio, InputLabel, SelectChangeEvent,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
//import './styles.css';
import MenuItem from "@mui/material/MenuItem"; // Import your CSS file
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { PetService } from '../../services/petService';
import petModel from '../../models/petModel';
import { useNavigate } from 'react-router';
import toastr from 'toastr';

const AdopterMyPets = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [petData, setPetData] = useState<petModel[]>([]);

    const fetchPets = async () => {
        try {
            var user_ID = localStorage.getItem('user_ID');
            if (user_ID !== null) {
                const response = await PetService.getPetsOfaAdopter(user_ID);
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const data: petModel[] = await response.json();
                console.log(data);
                setPetData(data);
            } else {
                toastr.error("Please login first.");
            }
        } catch (error) {
            console.error("There was an error fetching the pets:", error);
            toastr.error("There was an internal error fetching the pets.");
        }
    };

    const handleDetails = (pet_ID: number) => {
        navigate('/adopter/my-pet-details', { state: { pet_ID: pet_ID } });
    };

    const handleFetch = async () => {
        await fetchPets();
    }

    useEffect(() => {
        handleFetch();
    }
    , []);

    return (
        <Container >
            <Grid container justifyContent="center" spacing={2} style={{ marginTop: 20 }}>
            <TableContainer component={Box}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Pet Name</TableCell>
                            <TableCell>Pet Breed</TableCell>
                            <TableCell>Pet Species</TableCell>
                            <TableCell>Sex</TableCell>
                            <TableCell>Vaccination Status</TableCell>
                            <TableCell>Neuter Status</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {petData.map(pet => (
                            <TableRow key={pet.adopter_ID}>
                                <TableCell>{pet.name}</TableCell>
                                <TableCell>{pet.breed}</TableCell>
                                <TableCell>{pet.species}</TableCell>
                                <TableCell>{pet.sex}</TableCell>
                                {/* Assume time is not part of your model */}
                                <TableCell>{pet.vaccination_status ? 'Vaccinated' : 'Not Vaccinated'}</TableCell>
                                <TableCell>{pet.neutered_status ? 'Neutered' : 'Not Neutered'}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{ backgroundColor: "green" }}
                                        onClick={() => handleDetails(pet.pet_ID || 0)}
                                    >
                                        Details
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
}

export default AdopterMyPets;
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
import { PetService } from '../../../services/petService';
import petModel from '../../../models/petModel';
import { useNavigate } from 'react-router';
import toastr from 'toastr';

const HomeAdopter = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [petData, setPetData] = useState<petModel[]>([]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [breed, setBreed] = React.useState('');
    const [species, setSpecies] = React.useState('');
    const [age, setAge] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setBreed(event.target.value as string);
        setSpecies(event.target.value as string);
        setAge(event.target.value as string);
    };

    type AnimalType = 'dog' | 'cat';

    const fetchPets = async () => {
        try {
            const response = await PetService.getPetShelterDetails();
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data: petModel[] = await response.json();
            setPetData(data);
        } catch (error) {
            console.error("There was an error fetching the pets:", error);
            toastr.error("There was an internal error fetching the pets.");
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);


    const handleDetails = (pet_ID: number) => {
        navigate('/adopter/pet-details', { state: { pet_ID: pet_ID } });
    };
    
    const filterAnimalsByType = (type: AnimalType) => {
        return petData.filter((animal) => animal.species === type);
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

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

    return (
        <Box m={2} pt={3}>
        <Container >
            <Typography variant="h4" align="center" gutterBottom>
                Every Pet Deserves a Loving Home.{' '}<br/>
                <span style={{ color: 'red', fontWeight: 'bold'}}>Adopt</span> a Pet Today
            </Typography>
            <Typography variant="body1" align="center" paragraph>
                Browse our available animals and learn more about the adoption process. Together, we can rescue, rehabilitate, and rehome pets in need. Thank you for supporting our mission to bring joy to families through pet adoption.
            </Typography>

            {/* Filter and Search Bar */}
            <Grid container justifyContent="center" >
                <Button
                    onClick={handleOpen}
                    style={{
                        backgroundColor: 'grey',
                        color: 'white', // Optionally set the text color
                    }}
                >
                    Filter <FilterAltIcon />
                </Button>
                <Modal sx={{borderRadius: 100}}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={filterStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Filtering Options
                        </Typography>
                        {/* Breed Dropdown */}
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Breed</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={breed}
                                    label="Breed"
                                    onChange={handleChange}
                                >
                                    {/* TODO
                                    breedleri çek menü item olarak göster*/}
                                    <MenuItem value={10}>Husky</MenuItem>
                                    <MenuItem value={20}>Kangal</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Species Dropdown */}
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Species</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={species}
                                    label="Species"
                                    onChange={handleChange}
                                >
                                    {/* TODO
                                    speciesleri çek menü item olarak göster*/}
                                    <MenuItem value={10}>Cat</MenuItem>
                                    <MenuItem value={20}>Dog</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Age Dropdown */}
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={age}
                                    label="Age"
                                    onChange={handleChange}
                                >
                                    {/* TODO
                                    speciesleri çek menü item olarak göster*/}
                                    <MenuItem value={10}>1</MenuItem>
                                    <MenuItem value={20}>2</MenuItem>
                                    <MenuItem value={10}>3</MenuItem>
                                    <MenuItem value={20}>4</MenuItem>
                                    <MenuItem value={10}>5</MenuItem>
                                    <MenuItem value={20}>6</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>


                        {/* Sex TextField */}
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="female"  control={<Radio style={{ color: '#FF0000' }} />} label="Female" />
                                <FormControlLabel value="male" control={<Radio style={{ color: '#FF0000' }} />} label="Male" />
                            </RadioGroup>
                        </FormControl>

                        {/* Medical History TextField */}
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Medical History</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="all-vacc" control={<Radio style={{ color: '#FF0000' }} />} label="All vaccinations up to date" />
                                <FormControlLabel value="spayed-neutered" control={<Radio style={{ color: '#FF0000' }} />} label="All vaccinations not up to date" />
                            </RadioGroup>
                        </FormControl>

                        {/* Medical History TextField */}
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Medical History</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="spayed-neutered" control={<Radio style={{ color: '#FF0000' }} />} label="Spayed/Neutered" />
                                <FormControlLabel value="all-vacc" control={<Radio style={{ color: '#FF0000' }} />} label="Not spayed/neutered" />
                            </RadioGroup>
                        </FormControl>

                        {/* House Trained TextField */}
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">House Trained</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="all-vacc" control={<Radio style={{ color: '#FF0000' }} />} label="House trained" />
                                <FormControlLabel value="spayed-neutered" control={<Radio style={{ color: '#FF0000' }} />} label="Not house trained" />
                            </RadioGroup>
                        </FormControl>

                        {/* Apply Button */}
                        <Button variant="contained" onClick={handleClose} fullWidth sx={{ backgroundColor: '#FF0000', color: 'white' }}>
                            Apply Filters
                        </Button>
                    </Box>
                </Modal>
                <Grid item xs={12} sm={6}>
                    {/* Search Bar */}
                    <TextField label="Search animals..." variant="outlined" fullWidth />
                </Grid>
            </Grid>
            <Grid container justifyContent="center" spacing={2} style={{ marginTop: 20 }}>
                <TableContainer component={Box}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Pet Name</TableCell>
                                <TableCell>Pet Breed</TableCell>
                                <TableCell>Pet Species</TableCell>
                                <TableCell>Sex</TableCell>
                                <TableCell>Shelter Name</TableCell>
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
                                    <TableCell>{pet.shelter_name}</TableCell>
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
        </Box>
    );
};


export default HomeAdopter;

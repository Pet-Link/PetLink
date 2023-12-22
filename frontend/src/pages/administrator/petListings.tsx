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
    FormControlLabel, RadioGroup, FormLabel, FormControl, Radio, InputLabel, SelectChangeEvent, TableCell, TableHead, TableRow, TableBody, Table, TableContainer,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
//import './styles.css';
import MenuItem from "@mui/material/MenuItem"; // Import your CSS file
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useNavigate } from 'react-router';
import petModel from '../../models/petModel';
import { PetService } from '../../services/petService';
import toastr from 'toastr';


const PetListings: React.FC = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [petData, setPetData] = useState<petModel[]>([]);
    const [filteredPetData, setFilteredPetData] = useState<petModel[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setBreed('');
        setSpecies('');
        setAge('');
        setSex('');
        setVaccinationStatus('');
        setNeuterStatus('');
        setHouseTrainedStatus('');
        setOpen(false);
    }

    const [breed, setBreed] = React.useState('');
    const [species, setSpecies] = React.useState('');
    const [age, setAge] = React.useState('');
    const [sex, setSex] = React.useState('');
    const [vaccinationStatus, setVaccinationStatus] = React.useState('');
    const [neuterStatus, setNeuterStatus] = React.useState('');
    const [houseTrainedStatus, setHouseTrainedStatus] = React.useState('');

    const [breeds, setBreeds] = React.useState([]);
    const [specieses, setSpecieses] = React.useState([]);

    const handleBreedChange = (event: SelectChangeEvent) => {
        setBreed(event.target.value as string);
    };

    const handleSpeciesChange = (event: SelectChangeEvent) => {
        setSpecies(event.target.value as string);
    }

    const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAge(event.target.value);
    }

    const handleSexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSex(event.target.value);
    }

    const handleVaccinationStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVaccinationStatus(event.target.value);
    }

    const handleNeuterStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNeuterStatus(event.target.value);
    }

    const handleHouseTrainedStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHouseTrainedStatus(event.target.value);
    }

    const fetchPets = async () => {
        try {
            var shelter_ID = localStorage.getItem('user_ID');
            if (shelter_ID !== null) { 
                const response = await PetService.getPetsWithShelters();
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const data: petModel[] = await response.json();
                console.log(data);
                setPetData(data);
                setFilteredPetData(data); // Set the filtered data as well
            }
        } catch (error) {
            console.error("There was an error fetching the pets:", error);
            toastr.error("There was an internal error fetching the pets.");
        }
    };

    const populateBreedDropdown = async () => {
        await PetService.getBreeds().then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setBreeds(data);
                });
            }
        }
        );
    }

    const populateSpeciesDropdown = async  () => {
        await PetService.getSpecies().then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setSpecieses(data);
                });
            }
        }
        );
    }

    const handleApplyFilter = () => {
        var tBreed = breed;
        if (breed !== '') {
            tBreed = (breed[0]);
        }
        var tSpecies = species;
        if (species !== '') {
            tSpecies = (species[0]);
        }
        // Filter the data
        PetService.filterPets("1", tBreed, tSpecies, age, vaccinationStatus, neuterStatus, houseTrainedStatus, sex).then(async (response) => {
            if (response.status === 404) {
                setFilteredPetData([]);
                response.text().then((text) => {
                    toastr.info(text);
                });
            } else if (!response.ok) {
                throw new Error('Network response was not ok.');
            } else {
                const data: petModel[] = await response.json(); 
                setFilteredPetData(data);
            }  
        }
        );

        handleClose();
    };


    const handleManageListing = (pet_ID: number) => {
        navigate('/administrator/edit-pet-details', { state: { pet_ID: pet_ID } });
    };

    const handleFetch = async () => {
        await fetchPets();
        await populateBreedDropdown();
        await populateSpeciesDropdown();
    }

    useEffect(() => {
        handleFetch();
    }
    , []);

    const handleSearch = () => {
        if (searchQuery === '') {
            fetchPets();
        }
        // Filter the data
        PetService.searchPetsbyName("1", searchQuery).then(async (response) => {
            if (response.status === 404) {
                setFilteredPetData([]);
                response.text().then((text) => {
                    toastr.info(text);
                });
            } else if (!response.ok) {
                throw new Error('Network response was not ok.');
            } else {
                const data: petModel[] = await response.json(); 
                setFilteredPetData(data);
            }  
        }
        );
    };  

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };
    
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
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
                {/* <Button
                    onClick={handleFetch}
                    style={{
                        backgroundColor: 'green',
                        color: 'white', // Optionally set the text color
                    }}
                >
                    Fetch
                </Button> */}
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
                                    onChange={handleBreedChange}
                                >
                                    {breeds.map((breedItem) => (
                                        <MenuItem key={breedItem} value={breedItem}>{breedItem}</MenuItem>
                                    ))}
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
                                    onChange={handleSpeciesChange}
                                >
                                    {specieses.map((speciesItem) => (
                                        <MenuItem key={speciesItem} value={speciesItem}>{speciesItem}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Age Input Field */}
                        <TextField
                            id="age-input"
                            label="Age"
                            value={age}
                            onChange={handleAgeChange}
                            fullWidth
                        />

                        {/* Sex TextField */}
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group"
                                value={sex}
                                onChange={handleSexChange}
                            >
                                <FormControlLabel value="female"  control={<Radio style={{ color: '#FF0000' }} />} label="Female" />
                                <FormControlLabel value="male" control={<Radio style={{ color: '#FF0000' }} />} label="Male" />
                            </RadioGroup>
                        </FormControl>

                        {/* Medical History TextField */}
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Vaccination Status</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                                value={vaccinationStatus}
                                onChange={handleVaccinationStatusChange}
                            >
                                <FormControlLabel value="1" control={<Radio style={{ color: '#FF0000' }} />} label="All vaccinations up to date" />
                                <FormControlLabel value="0" control={<Radio style={{ color: '#FF0000' }} />} label="All vaccinations not up to date" />
                            </RadioGroup>
                        </FormControl>

                        {/* Neutured TextField */}
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Neuter Status</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                                value={neuterStatus}
                                onChange={handleNeuterStatusChange}
                            >
                                <FormControlLabel value="1" control={<Radio style={{ color: '#FF0000' }} />} label="Spayed/Neutered" />
                                <FormControlLabel value="0" control={<Radio style={{ color: '#FF0000' }} />} label="Not spayed/neutered" />
                            </RadioGroup>
                        </FormControl>

                        {/* House Trained TextField */}
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">House Trained</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                                value={houseTrainedStatus}
                                onChange={handleHouseTrainedStatusChange}
                            >
                                <FormControlLabel value="1" control={<Radio style={{ color: '#FF0000' }} />} label="House trained" />
                                <FormControlLabel value="0" control={<Radio style={{ color: '#FF0000' }} />} label="Not house trained" />
                            </RadioGroup>
                        </FormControl>

                        {/* Apply Button */}
                        <Button variant="contained" onClick={handleApplyFilter} fullWidth sx={{ backgroundColor: '#FF0000', color: 'white' }}>
                            Apply Filters
                        </Button>
                    </Box>
                </Modal>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label="Search Animals by Their Name" 
                        variant="outlined" 
                        fullWidth 
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress} // Add this line
                    />
                </Grid>
                <Button 
                        onClick={handleSearch}
                        style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                    >
                        Search
                </Button>
            </Grid>

            <Typography variant="h5" align="center" style={{fontWeight: "bold", marginTop: 25}}>
                All the Pets Available in the PetLink Added by Shelters
            </Typography>
            <Grid container justifyContent="center" spacing={2} style={{ marginTop: 20 }}>
                <TableContainer component={Box}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Pet Name</TableCell>
                                <TableCell>Shelter Name</TableCell>
                                <TableCell>Pet Breed</TableCell>
                                <TableCell>Pet Species</TableCell>
                                <TableCell>Sex</TableCell>
                                <TableCell>Vaccination Status</TableCell>
                                <TableCell>Neuter Status</TableCell>
                                <TableCell>Adoption Fee</TableCell>
                                <TableCell>Adoption Status</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPetData.map(pet => (
                                <TableRow key={pet.adopter_ID}>
                                    <TableCell>{pet.name}</TableCell>
                                    <TableCell>{pet.shelter_name}</TableCell>
                                    <TableCell>{pet.breed}</TableCell>
                                    <TableCell>{pet.species}</TableCell>
                                    <TableCell>{pet.sex}</TableCell>
                                    <TableCell>{pet.vaccination_status ? 'Vaccinated' : 'Not Vaccinated'}</TableCell>
                                    <TableCell>{pet.neutered_status ? 'Neutered' : 'Not Neutered'}</TableCell>
                                    <TableCell>{pet.adoption_fee} $</TableCell>
                                    <TableCell>{pet.adoption_status ? 'Adopted' : 'Not Adopted'}</TableCell>
                                    {!pet.adoption_status && (
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                style={{ backgroundColor: "orange", height: "25%" }}
                                                onClick={() => handleManageListing(pet.pet_ID || 0)}
                                            >
                                                Manage Listing
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Container>
        </Box>
    );
}

export default PetListings;
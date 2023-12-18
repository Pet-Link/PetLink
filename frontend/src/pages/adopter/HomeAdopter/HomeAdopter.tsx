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

const HomeAdopter = () => {

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
        const animalData: petModel[] = [];

    type AnimalType = 'dog' | 'cat';

    const refresh_list = () => {
        PetService.getPets().then((res) => {
            setPetData([]);
            res.json().then((data) => {
                data.forEach((pet: petModel) => {
                    petData.push(pet);
                    setPetData(petData);
                }
                );
            }
            );
        }
        );
        // disable the button after click and make it non-clickable
        const refreshButton = document.getElementById("refresh_button") as HTMLButtonElement;
        refreshButton.disabled = true;
        refreshButton.style.backgroundColor = "grey";
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
                    <Button id='refresh_button' variant="contained" onClick={refresh_list} fullWidth sx={{ backgroundColor: '#FF0000', color: 'white' }}>
                            Refresh
                    </Button>
                </Grid>
            </Grid>

            {/* Pet Categories */}
            {/* Pet Categories */}
            <Grid container justifyContent="center" spacing={2} style={{ marginTop: 20 }}>
                {/* Dogs */}
                <Grid item container alignItems="center" spacing={2}>
                    {filterAnimalsByType('dog').map((dog) => (
                        <Grid item key={`dog-${dog.species}`} xs={6} sm={3}>
                            <Card>
                                <CardContent>
                                    <img
                                        src={`./HomePageAnimals/dog-${dog.pet_ID}.png`}
                                        alt={`Dog ID: ${dog.pet_ID}`}
                                        style={{ width: '100%', height: 'auto', marginBottom: 8 }}
                                    />
                                    <Typography variant="h6" style={{fontWeight: 'bold'}}>
                                        {`${dog.breed}`}
                                        <br />
                                        {`${dog.age}`}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Cats */}
                <Grid item container spacing={2} alignItems="center">
                    {filterAnimalsByType('cat').map((cat) => (
                        <Grid item key={`cat-${cat.species}`} xs={6} sm={3}>
                            <Card>
                                <CardContent>
                                    <img
                                        src={`./HomePageAnimals/cat-${cat.pet_ID}.png`}
                                        alt={`Cat ${cat.age}`}
                                        style={{ width: '100%', height: 'auto', marginBottom: 8 }}
                                    />
                                    <Typography variant="h6" style={{fontWeight: 'bold' , marginBottom: 0 }}>
                                        {`${cat.breed}`}
                                        <br />
                                        {`${cat.age}`}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>


        </Container>
        </Box>
    );
};

export default HomeAdopter;

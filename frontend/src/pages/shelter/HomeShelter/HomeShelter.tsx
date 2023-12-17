import React, { useState } from 'react';
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

const HomeShelter = () => {

    const [open, setOpen] = useState(false);

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
        const animalData = [
            { type: 'dog', number: 1, breed: 'Huskies' ,count: '15'},
            { type: 'dog', number: 2, breed: 'Labrador Retriever' ,count: '30'},
            { type: 'dog', number: 3, breed: 'Golden Retriever' ,count: '50'},
            { type: 'dog', number: 4, breed: 'Bulldog',count: '45' },
            { type: 'cat', number: 1, breed: 'Siamese' ,count: '35'},
            { type: 'cat', number: 2, breed: 'Persian' ,count: '3'},
            { type: 'cat', number: 3, breed: 'Van' ,count: '5'},
            { type: 'cat', number: 4, breed: 'Persian',count: '95' },
            // Add more animal data as needed
        ];

    type AnimalType = 'dog' | 'cat';

    const filterAnimalsByType = (type: AnimalType) => {
        return animalData.filter((animal) => animal.type === type);
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
                Shelters: {' '}
                <span style={{ color: 'red', fontWeight: 'bold'}}>Profile, list, approve adoptions, engage in forums, and update</span>  credentials seamlessly.
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

            <Typography variant="h5" align="center" style={{fontWeight: "bold", marginTop: 25}}>
                Pets Currently Available In Your Shelter
            </Typography>

            {/* Pet Categories */}
            <Grid container justifyContent="center" spacing={2} style={{ marginTop: 20 }}>
                {/* Dogs */}
                <Grid item container alignItems="center" spacing={2}>
                    {filterAnimalsByType('dog').map((dog) => (
                        <Grid item key={`dog-${dog.breed}`} xs={6} sm={3}>
                            <Card>
                                <CardContent>
                                    <img
                                        src={`./HomePageAnimals/dog-${dog.number}.png`}
                                        alt={`Dog ${dog.number}`}
                                        style={{ width: '100%', height: 'auto', marginBottom: 8 }}
                                    />
                                    <Typography variant="h6" style={{fontWeight: 'bold'}}>
                                        {`${dog.breed}`}
                                        <br />
                                        {`${dog.count}`}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Cats */}
                <Grid item container spacing={2} alignItems="center">
                    {filterAnimalsByType('cat').map((cat) => (
                        <Grid item key={`cat-${cat.breed}`} xs={6} sm={3}>
                            <Card>
                                <CardContent>
                                    <img
                                        src={`./HomePageAnimals/cat-${cat.number}.png`}
                                        alt={`Cat ${cat.number}`}
                                        style={{ width: '100%', height: 'auto', marginBottom: 8 }}
                                    />
                                    <Typography variant="h6" style={{fontWeight: 'bold' , marginBottom: 0 }}>
                                        {`${cat.breed}`}
                                        <br />
                                        {`${cat.count}`}
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

export default HomeShelter;

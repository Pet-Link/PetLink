import React, { useState, useEffect } from 'react';
import { Typography, TextField, Select, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Grid, Stack, FormGroup, Checkbox, IconButton } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { PetService } from '../../services/petService';
import toastr from 'toastr';
import petModel from '../../models/petModel';
import { useLocation, useNavigate } from 'react-router';
import HomeIcon from '@mui/icons-material/Home';

const EditPetDetailsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');
    const [houseTrained, setHouseTrained] = useState('');
    const [adoptionFee, setAdoptionFee] = useState('');
    const [details, setDetails] = useState('');
    const [buttonText, setButtonText] = useState('Choose Photo');
    const [photo, setPhoto] = useState<File | null>(null);
    const [species, setSpecies] = useState('');
    const [vaccination_status, setVaccinationStatus] = useState(false);
    const [neutered_status, setNeuteredStatus] = useState(false);
    const [adoption_status, setAdoptionStatus] = useState(false);

    //const pet_ID = 2; // TODO like below
    const { pet_ID } = location.state || {};

    const [pet, setPet] = useState<petModel>();
    
    const fetchPet = async () => {
        try {
            const response = await PetService.getPetById(pet_ID);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data: petModel = await response.json();
            // set initial values
            setPet(data);
            setName(data.name);
            setBreed(data.breed);
            setAge(data.age);
            setSex(data.sex);
            setHouseTrained(data.house_trained_status == true ? "yes" : "no",);
            setAdoptionFee(data.adoption_fee.toString());
            setDetails(data.description);
            setSpecies(data.species);
            setVaccinationStatus(data.vaccination_status);
            setNeuteredStatus(data.neutered_status);
            setAdoptionStatus(data.adoption_status || false)

        } catch (error) {
            console.error("There was an error fetching the applications:", error);
        }
    };

    useEffect(() => {
        fetchPet();
    }, []);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleBreedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBreed(event.target.value);
    };

    const handleSpeciesChange = (event: SelectChangeEvent) => {
        setSpecies(event.target.value as string);
    };

    const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAge(event.target.value);
    };

    const handleSexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSex(event.target.value);
    };

    const handleVaccinationStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVaccinationStatus(!vaccination_status);
    };

    const handleNeuteredStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNeuteredStatus(!neutered_status);
    }

    const handleHouseTrainedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHouseTrained(event.target.value);
    };

    const handleDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {   
        setDetails(event.target.value);
    };

    const handleAdoptionFeeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAdoptionFee(event.target.value);
    };

    const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement> ) => {
        event.preventDefault();
        
        const files = event.target.files;

        if (files && files.length > 0) {
            setButtonText(files[0].name);
          } else {
            setButtonText('Choose File');
          }
    };

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setPhoto(file);
        }
    };

    const handleSubmit = () => {
        // check if age is a number
        if (isNaN(parseInt(age))) {
            toastr.error('Age must be a number');
            return;
        }
        // check if adoption fee is a number
        if (isNaN(parseFloat(adoptionFee))) {
            toastr.error('Adoption fee must be a number');
            return;
        }
        // check if sex field is empty string
        if (sex === '') {
            toastr.error('Sex must be selected');
            return;
        }
        // check if species field is empty string
        if (species === '') {
            toastr.error('Species must be selected');
            return;
        }
        // check if name field is empty string
        if (name === '') {
            toastr.error('Name must be entered');
            return;
        }
        // check if breed field is empty string
        if (breed === '') {
            toastr.error('Breed must be entered');
            return;
        }
        // check if house trained field is empty string
        if (houseTrained === '') {
            toastr.error('House trained must be selected');
            return;
        }
        // check if details field is empty string
        if (details === '') {
            toastr.error('Details must be entered');
            return;
        }
        const pet: petModel = {
            pet_ID: pet_ID,
            species: species,
            name: name,
            breed: breed,
            age: age,
            // if neutered_status is true set to 1, else 0
            neutered_status: neutered_status,
            // if vaccination_status is true set to 1, else 0
            vaccination_status: vaccination_status,
            shelter_ID: parseInt(localStorage.getItem('user_ID') || '0'),
            sex: sex,
            description: details,
            house_trained_status: houseTrained === 'yes' ? true : false,
            adoption_fee: parseFloat(adoptionFee),
            shelter_name: null, // this is not checked
            adoption_status: adoption_status,
        }
        PetService.updatePet(pet).then((response) => {
            if (response.ok) {
                toastr.success('Successfully edited pet');
            } else {
                toastr.error('Failed to edit pet');
            }
        }
        );
    };

    const handleDelete = () => {
        PetService.deletePet(pet_ID).then((response) => {
            if (response.ok) {
                toastr.success('Successfully deleted pet');
                navigate('/administrator/home');
            } else {
                toastr.error('Failed to delete pet');
            }
        }
        );
    };
    
    const goBackHome = () => {
        navigate('/administrator/home');
    }

    return (
        <Grid sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 10, 
            mb: 5
        }}>
                    <Typography variant="h4" gutterBottom>
                        Edit Pet
                    </Typography>

            <Stack spacing={20} justifyContent="center" alignItems="flex-start" direction="row">
                <Stack spacing={2} direction="column">
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <TextField
                            value={name}
                            onChange={handleNameChange}
                            fullWidth
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Breed</FormLabel>
                        <TextField
                            value={breed}
                            onChange={handleBreedChange}
                            fullWidth
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Species</FormLabel>
                        <Select value={species} onChange={handleSpeciesChange}>
                            <MenuItem value="dog">Dog</MenuItem>
                            <MenuItem value="cat">Cat</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Age</FormLabel>
                        <TextField
                            value={age}
                            onChange={handleAgeChange}
                            fullWidth
                            type="number"
                        />
                    </FormControl>

                    <FormControl component="fieldset">
                        <FormLabel>Sex</FormLabel>
                        <RadioGroup value={sex} onChange={handleSexChange} >
                            <FormControlLabel value="female" control={<Radio color='secondary'/>} label="Female" />
                            <FormControlLabel value="male" control={<Radio color='secondary'/>} label="Male" />
                        </RadioGroup>
                    </FormControl>

                    <FormControl component="fieldset">
                        <FormLabel>Medical History</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox color='secondary' checked={vaccination_status} onChange={handleVaccinationStatus} name="allVaccinations" />}
                                label="All vaccinations up to date"
                            />
                            <FormControlLabel
                                control={<Checkbox color='secondary' checked={neutered_status} onChange={handleNeuteredStatus} name="spayedNeutered" />}
                                label="Spayed / Neutered"
                            />
                        </FormGroup>
                    </FormControl>

                    <FormControl component="fieldset">
                        <FormLabel>House Trained</FormLabel>
                        <RadioGroup value={houseTrained} onChange={handleHouseTrainedChange}>
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Stack>
                <Stack spacing={2} direction="column">
                    <TextField label="Details" value={details} onChange={handleDetailsChange} multiline rows={4}/>

                    <TextField label="Adoption Fee" value={adoptionFee} onChange={handleAdoptionFeeChange} />

                    <Grid>
                        <Typography fontSize={'16px'}>Upload Photo</Typography>
                        <input name="fileInput" id="fileInput" style={{ display: 'none' }} type="file" onChange={handleFileSelection} />
                        <label htmlFor="fileInput">
                        <Button sx={{mb:5}} variant="outlined" component="span" fullWidth color="success" startIcon={<CloudUploadIcon/>}>
                            {buttonText && buttonText !== '' ? buttonText : 'Choose File'}
                        </Button>
                        </label>
                    </Grid>

                    <Button variant="contained" color="secondary" onClick={handleSubmit}>Submit Edit</Button>
                    <Button variant="contained" color="primary" onClick={handleDelete} sx={{bgcolor: '#C30404'}}>Delete Pet</Button>
                    {/* <Button onClick={goBackHome} variant='contained' color='primary'>
                        Go to Dashboard
                    </Button> */}
                </Stack>
            </Stack>
        </Grid>
    );
};

export default EditPetDetailsPage;

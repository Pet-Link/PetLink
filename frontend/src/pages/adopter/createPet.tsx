import React, { useState } from 'react';
import { Typography, TextField, Select, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Grid, Stack, FormGroup, Checkbox } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { PetService } from '../../services/petService';
import toastr from 'toastr';
import petModel from '../../models/petModel';

const CreatePet = () => {
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');
    const [houseTrained, setHouseTrained] = useState('');
    const [adoptionFee, setAdoptionFee] = useState('');
    const [details, setDetails] = useState('');
    const [buttonText, setButtonText] = useState('Choose Photo');
    const [photo, setPhoto] = useState<File | null>(null);
    const [species, setSpecies] = useState('');
    const [vaccination_status, setVaccinationStatus] = useState(false);
    const [neutered_status, setNeuteredStatus] = useState(false);

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

    const handleMedicalHistoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMedicalHistory(event.target.value);
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
        if (isNaN(parseInt(adoptionFee))) {
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
            species: species,
            name: name,
            breed: breed,
            age: age,
            // if neutered_status is true set to 1, else 0
            neutered_status: neutered_status,
            // if vaccination_status is true set to 1, else 0
            vaccination_status: vaccination_status,
            shelter_ID: parseInt(localStorage.getItem('user_id') || '0'),
            sex: sex,
            description: details,
            house_trained_status: houseTrained === 'yes' ? true : false,
            adoption_fee: adoptionFee === '' ? 0 : parseInt(adoptionFee),
        }
        PetService.addPet(pet).then((response) => {
            if (response.ok) {
                toastr.success('Successfully added animal');
                // if (photo) {
                //     const formData = new FormData();
                //     formData.append('file', photo);
                //     PetService.addPhoto(response.data.pet_ID, formData).then((response) => {
                //         if (response.status === 201) {
                //             toastr.success('Successfully added photo');
                //         } else {
                //             toastr.error('Failed to add photo');
                //         }
                //     });
                // }
            } else {
                toastr.error('Failed to add animal');
            }
        }
        );
    };

    return (
        <Grid sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 20, 
            mb: 5
        }}>
            <Typography sx={{mb:10}} variant="h4">Enter the Details of the Animal</Typography>
            <Stack spacing={20} justifyContent="center" alignItems="flex-start" direction="row">
                <Stack spacing={2} direction="column">
                    <TextField label="Name" value={name} onChange={handleNameChange} />
                    <FormControl>
                        <FormLabel>Breed</FormLabel>
                        <TextField
                            label="Enter breed"
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
                            label="Enter a number"
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
                                control={<Checkbox color='secondary' onChange={handleVaccinationStatus} name="allVaccinations" />}
                                label="All vaccinations up to date"
                            />
                            <FormControlLabel
                                control={<Checkbox color='secondary' onChange={handleNeuteredStatus} name="spayedNeutered" />}
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
                    <TextField label="Add Details" value={details} onChange={handleDetailsChange} multiline rows={4}/>

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

                    <Button variant="contained" color="secondary" onClick={handleSubmit}>Submit</Button>
                </Stack>
            </Stack>
        </Grid>
    );
};

export default CreatePet;
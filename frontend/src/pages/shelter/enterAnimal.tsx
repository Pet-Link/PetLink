import React, { useState } from 'react';
import { Typography, TextField, Select, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Grid, Stack, FormGroup, Checkbox } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { PetService } from '../../services/petService';
import toastr from 'toastr';

const EnterAnimalDetailsPage = () => {
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

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleBreedChange = (event: SelectChangeEvent) => {
        setBreed(event.target.value as string);
    };

    const handleAgeChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };

    const handleSexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSex(event.target.value);
    };

    const handleMedicalHistoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMedicalHistory(event.target.value);
    };

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
        // TODO: complete the submit logic
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
                        <Select value={breed} onChange={handleBreedChange}>
                            <MenuItem value="breed1">Breed 1</MenuItem>
                            <MenuItem value="breed2">Breed 2</MenuItem>
                            <MenuItem value="breed3">Breed 3</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Age</FormLabel>
                        <TextField
                            label="Enter a number"
                            fullWidth
                            type="number"
                        />
                    </FormControl>

                    <FormControl component="fieldset">
                        <FormLabel>Sex</FormLabel>
                        <RadioGroup value={sex} onChange={handleSexChange}>
                            <FormControlLabel value="female" control={<Radio color='secondary'/>} label="Female" />
                            <FormControlLabel value="male" control={<Radio color='secondary'/>} label="Male" />
                        </RadioGroup>
                    </FormControl>

                    <FormControl component="fieldset">
                        <FormLabel>Medical History</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox color='secondary' onChange={handleMedicalHistoryChange} name="allVaccinations" />}
                                label="All vaccinations up to date"
                            />
                            <FormControlLabel
                                control={<Checkbox color='secondary' onChange={handleMedicalHistoryChange} name="spayedNeutered" />}
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
                    <TextField label="Add Details" value={details} multiline rows={4}/>

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

export default EnterAnimalDetailsPage;

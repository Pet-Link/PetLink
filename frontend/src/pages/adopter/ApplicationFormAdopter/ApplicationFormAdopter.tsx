import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typography, Grid, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { adoptionApplicationService } from '../../../services/adoptionApplicationService';
import toastr from 'toastr';
import applyAdoptModel from '../../../models/applyAdoptModel';
import adopterModel from '../../../models/adopterModel';
import { AdopterService } from '../../../services/adopterService';

const AdoptionApplicationPage = () => {
    const inputStyle = { marginBottom: '20px', alignItems: 'center'};
    const navigate = useNavigate();
    const location = useLocation();
    const { pet_ID, petName, shelterName} = location.state || {};

    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');
    const [petOwnership, setPetOwnership] = useState('');
    const [petCareExperience, setPetCareExperience] = useState('');
    const [housingSituation, setHousingSituation] = useState('');
    const [adoptionReason, setAdoptionReason] = useState('');

    const [adopter, setAdopter] = useState<adopterModel>();

    const fetchApplications = async () => {
        try {
            const response = await AdopterService.getAdopter(parseInt(localStorage.getItem('user_ID') || '0'));
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data: adopterModel = await response.json();
            setAdopter(data);
        } catch (error) {
            console.error("There was an error fetching the applications:", error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);


    const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAge(event.target.value);
    };
    
    const handleSexChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setSex(value); // RadioGroup passes the value as a second argument
    };
    
    const handlePetOwnershipChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setPetOwnership(value); 
    };
    
    const handlePetCareExperienceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPetCareExperience(event.target.value);
    };
    
    const handleHousingSituationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHousingSituation(event.target.value);
    };
    
    const handleAdoptionReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAdoptionReason(event.target.value);
    };
    
    // TODO Balance? 
    const handleApply = () => {
        // Validation checks
        if (!age || isNaN(parseInt(age)) || parseInt(age) <= 0 || parseInt(age) >= 130) {
            toastr.error('Please enter a valid age.');
            return;
        }

        if (!sex) {
            toastr.error('Please select a sex.');
            return;
        }

        if (!petOwnership) {
            toastr.error('Please specify if you have other pets.');
            return;
        }

        if (!petCareExperience || isNaN(parseFloat(petCareExperience)) || parseFloat(petCareExperience) < 0) {
            toastr.error('Please enter a valid number of years of pet care experience.');
            return;
        }

        if (!housingSituation.trim()) {
            toastr.error('Please describe your current housing situation.');
            return;
        }

        if (!adoptionReason.trim()) {
            toastr.error('Please explain your reason for wanting to adopt.');
            return;
        }

        const application: applyAdoptModel = {
            adopter_ID: parseInt(localStorage.getItem('user_ID') || '0'),
            pet_ID: pet_ID,
            pet_ownership: petOwnership === 'yes' ? true : false,
            pet_care_experience: parseFloat(petCareExperience),
            housing_situation: housingSituation,
            adoption_reason: adoptionReason,

            // fields below are not checked 
            administrator_ID: null,
            adopter_name: null,
            approval_status: null,
            admin_remarks: null,
            date: null,
            pet_name: null,
            shelter_name: null,
            adopter_age: null,
            adopter_e_mail: null,
            adopter_sex: null,
        }
        adoptionApplicationService.applyForAdoption(age, sex, application).then((response) => {
            if (response.ok) {
                toastr.success('Successfully created an application.');
            } else {
                response.text().then((text) => {
                    try {
                        toastr.error(text);
                    } catch (error) {
                        console.error('Invalid JSON:', text);
                    }
                });
            }
        }
        );
    };

    return (
        <Grid container spacing={2} style={{ maxWidth: '700px', margin: 'auto', marginTop: '35px', textAlign: 'center' }}>
            <Grid item xs={12}>
                <Typography variant="h4" align="center" gutterBottom>
                    You are adopting: {petName} from {shelterName || "a"} shelter
                </Typography>
                <img
                    src="https://media.istockphoto.com/id/144804780/photo/dog-with-tennis-ball.jpg?s=612x612&w=0&k=20&c=7ES0wGFEMpZmU-Jax4YyrKywOJ7kFkDotHrcicxiIsM="
                    style={{ width: '350px', height: 'auto', borderRadius: 15}}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h4" align="center" gutterBottom>
                    Enter your information to adopt
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Your application will be evaluated, and we will contact you.
                </Typography>
            </Grid>

            {/* Age */}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Age
                </Typography>
                <TextField
                    label="Enter a number"
                    fullWidth
                    type="number"
                    value={age}
                    onChange={handleAgeChange}
                    style={inputStyle}
                />
            </Grid>

            {/* Sex */}
            <Grid item xs={12}>
                <FormControl fullWidth style={inputStyle}>
                    <Typography variant="h6" gutterBottom>
                        Sex
                    </Typography>
                    <RadioGroup row value={sex} onChange={handleSexChange}>
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                    </RadioGroup>
                </FormControl>
            </Grid>

            {/* Other pets information */}
            <Grid item xs={12}>
                <FormControl fullWidth style={inputStyle}>
                    <Typography variant="h6" gutterBottom>
                        Do you have other pets?
                    </Typography>
                    <RadioGroup row value={petOwnership} onChange={handlePetOwnershipChange}>
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
            </Grid>


            {/* Other Questions */}
            <Grid item xs={12}>
                
                <Typography variant="h6" gutterBottom>
                    For how many years have you been a pet owner?
                </Typography>
                <TextField
                    label="Enter a number"
                    fullWidth
                    type="number"
                    value={petCareExperience}
                    onChange={handlePetCareExperienceChange}
                    style={inputStyle}
                />
                <Typography variant="h6" gutterBottom>
                    Can you share your current housing situation?
                </Typography>
                <TextField
                    multiline
                    rows={4}
                    fullWidth
                    value={housingSituation}
                    onChange={handleHousingSituationChange}
                    label={`Please write the type of housing you have (apartment, single family, farm etc.),\nhow many adults and children reside, where will your pet sleep, etc.`}
                    style={inputStyle}
                />
                <Typography variant="h6" gutterBottom>
                    Why do you want to adopt?
                </Typography>
                <TextField
                    label="Please explain why you want to adopt and who the primary caregivers of your pet will be. "
                    multiline
                    rows={4}
                    fullWidth
                    value={adoptionReason}
                    onChange={handleAdoptionReasonChange}
                    style={inputStyle}
                />
            </Grid>

            {/* Adoption Fee and Balance */}
            <Grid item xs={12}>
                <Grid container spacing={2} justifyContent="center">
                    {/* Adoption Fee */}
                    <Grid item xs={6} md={3}>
                        <Typography variant="h6" gutterBottom>
                            Adoption Fee:
                        </Typography>
                        <Typography variant="body1">$100</Typography>
                    </Grid>

                    {/* Your Balance */}
                    <Grid item xs={6} md={3}>
                        <Typography variant="h6" gutterBottom>
                            Your Balance:
                        </Typography>
                        <Typography variant="body1">
                            ${adopter ? adopter.balance.toString() : 'Loading...'}
                        </Typography>
                    </Grid>

                    {/* Information Text */}
                    <Grid item xs={12}>
                        <Typography variant="body2">
                            Note: The adoption fee will be paid from your balance automatically after the acceptance
                            of your application!
                        </Typography>
                    </Grid>
                </Grid>
                {/* Submit Application Button */}
                <Grid item xs={12}>
                    <Button variant="contained" color="secondary" onClick={handleApply} sx= {{width:700, height: 50,marginBottom: '20px', alignItems: 'center', marginTop:3, bgcolor: '#04C35C'}}>
                        Submit Application
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AdoptionApplicationPage;

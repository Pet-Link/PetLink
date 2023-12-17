import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {Typography, Grid, FormControl, RadioGroup, FormControlLabel, Radio} from '@mui/material';
//TODO
//Application bilgileri çekilecek
const SeeAdoptionApplicationPage = () => {
    const inputStyle = {marginBottom: '20px', alignItems: 'center'};

    return (
        <Grid container spacing={2} style={{maxWidth: '700px', margin: 'auto', marginTop: '35px', textAlign: 'center'}}>
            <Grid item xs={12}>
                <Typography variant="h4" align="center" gutterBottom>
                    Requested pet:
                </Typography>
                <img
                    src={`./HomePageAnimals/dog-1.png`}
                    style={{width: '350px', height: 'auto', borderRadius: 15}}
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="secondary" sx={{
                    marginLeft: 5,
                    width: 200,
                    height: 50,
                    marginBottom: '20px',
                    alignItems: 'center',
                    bgcolor: '#C0C304'
                }}>
                    Go to Dog Detail Page
                </Button>
            </Grid>

            <Grid item xs={12}>
                <Typography variant="h4" align="center" gutterBottom>
                    Application Detail
                </Typography>
            </Grid>

            {/* Name*/}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Name
                </Typography>
                <TextField
                    value="Kardelen Ceren"
                    InputProps={{readOnly: true}}
                    label="Name of the Adopter"
                    fullWidth
                    style={inputStyle}
                />
            </Grid>

            {/* Date*/}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Application Date
                </Typography>
                <TextField
                    value="06/06/2023"
                    InputProps={{readOnly: true}}
                    label="Application Date"
                    fullWidth
                    style={inputStyle}
                />
            </Grid>

            {/* Mail*/}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Mail
                </Typography>
                <TextField
                    value="kardelenceren@testemail.com"
                    InputProps={{readOnly: true}}
                    label="Mail of the adopter"
                    fullWidth
                    style={inputStyle}
                />
            </Grid>

            {/* Age */}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Age
                </Typography>
                <TextField
                    value="30"
                    InputProps={{readOnly: true}}
                    label="Enter a number"
                    fullWidth
                    type="number"
                    style={inputStyle}
                />
            </Grid>

            {/* Sex */}
            <Grid item xs={12}>

                <Typography variant="h6" gutterBottom>
                    Gender
                </Typography>
                <TextField
                    label="Gender of the applicant"
                    fullWidth
                    value="Female"
                    InputProps={{readOnly: true}}
                    style={inputStyle}
                />
            </Grid>
            <Grid item xs={12}>
                {/* Other pets information */}
                <Typography variant="h6" gutterBottom>
                    Other pets
                </Typography>

                <TextField
                    label="Does the applicant have other pets?"
                    fullWidth
                    value="Yes"
                    InputProps={{readOnly: true}}
                    style={inputStyle}
                />
            </Grid>
            {/* Other Questions */}
            <Grid item xs={12}>

                <Typography variant="h6" gutterBottom>
                    For how many years have you been a pet owner?
                </Typography>
                <TextField
                    InputProps={{readOnly: true}}
                    label="Enter a number"
                    fullWidth
                    type="number"
                    value="5"
                    style={inputStyle}
                />
                <Typography variant="h6" gutterBottom>
                    Can you share your current housing situation?
                </Typography>
                <TextField
                    InputProps={{readOnly: true}}
                    multiline
                    rows={4}
                    fullWidth
                    value={`Apartment, 2 adults 3 children, the dog will sleep in the garden.`}
                    style={inputStyle}
                />
                <Typography variant="h6" gutterBottom>
                    Why do you want to adopt?
                </Typography>
                <TextField
                    InputProps={{readOnly: true}}
                    value="I love dogs! I am looking for a companion for me and for my 5 year old dog.  I will be the main caregiver."
                    multiline
                    rows={4}
                    fullWidth
                    style={inputStyle}
                />

                <Typography variant="h6" gutterBottom>
                    Administrator’s remarks
                </Typography>
                <TextField
                    label="Please explain why you are accepting or declining this application. "
                    multiline
                    rows={4}
                    fullWidth
                    style={inputStyle}
                />
            </Grid>

            {/* Submit Application Button */}
            <Grid item xs={12}>
                <Button variant="contained" color="secondary" sx={{
                    width: 200,
                    height: 50,
                    marginBottom: '20px',
                    alignItems: 'center',
                    marginTop: 3,
                    bgcolor: '#04C35C'
                }}>
                    Accept Application
                </Button>
                <Button variant="contained" color="secondary" sx={{
                    marginLeft: 5,
                    width: 200,
                    height: 50,
                    marginBottom: '20px',
                    alignItems: 'center',
                    marginTop: 3,
                    bgcolor: '#C30404'
                }}>
                    Decline Application
                </Button>
                <Button variant="contained" color="secondary" sx={{
                    marginLeft: 5,
                    width: 200,
                    height: 50,
                    marginBottom: '20px',
                    alignItems: 'center',
                    marginTop: 3,
                    bgcolor: '#000000'
                }}>
                    Delete Application
                </Button>
            </Grid>
        </Grid>
    );
};

export default SeeAdoptionApplicationPage;

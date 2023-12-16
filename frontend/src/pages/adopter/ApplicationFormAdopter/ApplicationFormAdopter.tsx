import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography, Grid, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const AdoptionApplicationPage = () => {
    const inputStyle = { marginBottom: '20px', alignItems: 'center'};

    return (
        <Grid container spacing={2} style={{ maxWidth: '700px', margin: 'auto', marginTop: '35px', textAlign: 'center' }}>
            <Grid item xs={12}>
                <Typography variant="h4" align="center" gutterBottom>
                    You are adopting: Luna from Happy Homes shelter
                </Typography>
                <img
                    src={`./HomePageAnimals/dog-1.png`}
                    style={{ width: '350px', height: 'auto', borderRadius: 15}}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h4" align="center" gutterBottom>
                    Enter your information to adopt
                </Typography>
            </Grid>

            {/* Name */}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Age
                </Typography>
                <TextField
                    label="Enter a number"
                    fullWidth
                    type="number"
                    style={inputStyle}
                />
            </Grid>

            {/* Sex */}
            <Grid item xs={12}>
                <FormControl fullWidth style={inputStyle}>
                    <Typography variant="h6" gutterBottom>
                        Sex
                    </Typography>
                    <RadioGroup row >
                        <FormControlLabel value="female" control={<Radio style={{ color: '#FF0000' }} />} label="Female" />
                        <FormControlLabel value="male" control={<Radio style={{ color: '#FF0000' }} />} label="Male" />
                        <FormControlLabel value="other" control={<Radio style={{ color: '#FF0000' }} />} label="Other" />
                    </RadioGroup>
                </FormControl>
            </Grid>

            {/* Other pets information */}
            <Grid item xs={12}>
                <FormControl fullWidth style={inputStyle}>
                    <Typography variant="h6" gutterBottom>
                        Do you have other pets?
                    </Typography>
                    <RadioGroup row >
                        <FormControlLabel value="yes" control={<Radio style={{ color: '#FF0000' }} />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio style={{ color: '#FF0000' }} />} label="No" />
                    </RadioGroup>
                </FormControl>
            </Grid>


            {/* Other Questions */}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Your application will be evaluated, and we will contact you.
                </Typography>

                <TextField label="Do you have other pets?" fullWidth style={inputStyle} />

                <Typography variant="h6" gutterBottom>
                    For how many years have you been a pet owner?
                </Typography>
                <TextField
                    label="Enter a number"
                    fullWidth
                    type="number"
                    style={inputStyle}
                />
                <Typography variant="h6" gutterBottom>
                    Can you share your current housing situation?
                </Typography>
                <TextField
                    multiline
                    rows={4}
                    fullWidth
                    value={`Please write the type of housing you have (apartment, single family, farm etc.),\nhow many adults and children reside, where will your pet sleep, etc.`}
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
                        <Typography variant="body1">$230</Typography>
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
                    <Button variant="contained" color="secondary" sx= {{width:700, height: 50,marginBottom: '20px', alignItems: 'center', marginTop:3, bgcolor: '#04C35C'}}>
                        Submit Application
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AdoptionApplicationPage;

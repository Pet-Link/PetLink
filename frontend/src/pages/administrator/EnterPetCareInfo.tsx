import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';

const EnterPetCareInfo = () => {
    const [petName, setPetName] = useState('');
    const [careInstructions, setCareInstructions] = useState('');

    const handlePetNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPetName(event.target.value);
    };

    const handleCareInstructionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCareInstructions(event.target.value);
    };

    const handleSubmit = () => {
        //pet care info girilecek
    };

    return (
        <Grid container spacing={2} sx={{flexDirection:'column', display: 'flex', justifyContent:'center', alignItems:'center'}}>
            <Grid item xs={12}>
                <Typography variant="h4" sx={{textAlign:'center', mt:5}}>
                    Enter Pet Care Information
                </Typography>
            </Grid>
            <Grid item >
                <TextField
                    label="Pet Name"
                    value={petName}
                    onChange={handlePetNameChange}
                    fullWidth
                    margin="normal"
                />
            </Grid>
            <Grid item sx={{width:'50%'}}>
                <TextField
                    label="Care Instructions"
                    value={careInstructions}
                    onChange={handleCareInstructionsChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                />
            </Grid>
            <Grid item >
                <Button type="submit" variant="contained" color="primary">
                    Save
                </Button>
            </Grid>
        </Grid>
    );
};

export default EnterPetCareInfo;

import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { PetCareInfoService } from '../../services/petCareInfoService';
import toastr from 'toastr';


const EnterPetCareInfo = () => {
    const [title, setTitle] = useState('');
    const [careInstructions, setCareInstructions] = useState('');


    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };


    const handleCareInstructionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCareInstructions(event.target.value);
    };


    const handleSubmit = async () => {
        const administrator_ID = parseInt(localStorage.getItem('user_ID') || "0");

        // check if title and content is empty
        if (title === '') {
            toastr.error('Title must be entered.');
            return;
        }

        if (careInstructions === '') {
            toastr.error('Care instructions must be entered.');
            return;
        }

        try {
            const response = await PetCareInfoService.createPetCareInfo(careInstructions, title, administrator_ID);
            if (response.ok) {
                toastr.success("Pet care information successfully created.")
            } else {
                response.text().then((text) => {
                    toastr.error("Pet care information creation failed due to internal system error.")
                    console.error("Error creating pet care info:", text);
                });
            }
        } catch (error) {
            toastr.error("Pet care information creation failed due to internal system error.")
            console.error("Error creating pet care info:", error);
        }
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
                    label="Title"
                    value={title}
                    onChange={handleTitleChange}
                    fullWidth
                    margin="normal"
                />
            </Grid>
            <Grid item sx={{width:'50%'}}>
                <TextField
                    label="Pet Care Instructions"
                    value={careInstructions}
                    onChange={handleCareInstructionsChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                />
            </Grid>
            <Grid item >
                <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                    Save
                </Button>
            </Grid>
        </Grid>
    );
};


export default EnterPetCareInfo;
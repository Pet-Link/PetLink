import React from 'react';
import { Typography, Grid } from '@mui/material';

const Statistics = () => {
    
    return (
        <Grid>
            <Typography variant="h4" gutterBottom>
                System Reports
            </Typography>

            <Typography variant="h6" gutterBottom>
                Top Vets
            </Typography>
            {/* Display top vets report here */}

            <Typography variant="h6" gutterBottom>
                Most Number of Pets Adopted by a User
            </Typography>
            {/* Display most adopted pets by a user report here */}

            <Typography variant="h6" gutterBottom>
                Most Adopted Pet Breed
            </Typography>
            {/* Display most adopted pet breed report here */}
        </Grid>
    );
};

export default Statistics;

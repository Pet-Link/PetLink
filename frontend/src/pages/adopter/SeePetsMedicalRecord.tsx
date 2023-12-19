import React from 'react';
import { Typography, Paper } from '@mui/material';

const SeePetsMedicalRecord = () => {
    return (
        <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
                Pet's Medical Record
            </Typography>
            {/* Display pet's medical information here */}
        </Paper>
    );
};

export default SeePetsMedicalRecord;

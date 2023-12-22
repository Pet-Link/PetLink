import React, { useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    TextField,
    Button,
} from '@mui/material';

import overseeRecordModel from '../../../models/overseeRecord';

const AddOverseeRecordPage: React.FC = () => {
    const [newRecord, setNewRecord] = useState<overseeRecordModel>({
        record_ID: 0,
        administrator_ID: 0,
        adopter_ID: 0,
        date: new Date(),
        details: '',
        verification_status: null,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewRecord((prevRecord) => ({ ...prevRecord, [name]: value }));
    };

    const handleAddRecord = () => {
        // Convert the date string to a Date object
        const dateObject = new Date(newRecord.date);
        // Add logic to send the new oversee record data to the server or perform any required actions
        console.log('Adding Oversee Record:', { ...newRecord, date: dateObject });
        // You can reset the form or perform other actions after adding the record
        setNewRecord({
            record_ID: 0,
            administrator_ID: 0,
            adopter_ID: 0,
            date: new Date(),
            details: '',
            verification_status: null,
        });
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Add Oversee Record
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Administrator ID"
                        type="number"
                        name="administrator_ID"
                        value={newRecord.administrator_ID}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Adopter ID"
                        type="number"
                        name="adopter_ID"
                        value={newRecord.adopter_ID}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Date (YYYY-MM-DD)"
                        type="text"
                        name="date"
                        value={newRecord.date}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Details"
                        type="text"
                        name="details"
                        value={newRecord.details}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddRecord}
                    >
                        Add Record
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AddOverseeRecordPage;

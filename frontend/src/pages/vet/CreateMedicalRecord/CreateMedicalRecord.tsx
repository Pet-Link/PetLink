import React, { useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import medicalRecordModel from "../../../models/medicalRecordMode";

const LogMedicalRecord: React.FC = () => {
    const [medicalRecords, setMedicalRecords] = useState<medicalRecordModel[]>([]);
    const [medicalRecord, setMedicalRecord] = useState<medicalRecordModel>({
        record_ID: 0,
        pet_ID: 0,
        veterinarian_ID: 0,
        date: new Date(),
        operation: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMedicalRecord(prevState => ({ ...prevState, [name]: value }));
    };

    const handleLogRecord = () => {
        // Add logic to send the medical record data to the server or perform any required actions
        console.log('Logging Medical Record:', medicalRecord);

        // Update the list of medical records with the new record
        setMedicalRecords(prevRecords => [...prevRecords, medicalRecord]);

        // You can reset the form or perform other actions after logging the record
        setMedicalRecord({
            record_ID: 0,
            pet_ID: 0,
            veterinarian_ID: 0,
            date: new Date(),
            operation: '',
        });
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Log Medical Record
            </Typography>
            <Grid container justifyContent="center" spacing={2} style={{ marginTop: 20 }}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Pet ID"
                        type="number"
                        name="pet_ID"
                        value={medicalRecord.pet_ID}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Operation"
                        type="text"
                        name="operation"
                        value={medicalRecord.operation}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogRecord}
                    >
                        Log Record
                    </Button>
                </Grid>
            </Grid>
            {/* Display a table for logged medical records (this part can be extended based on your needs) */}
            <TableContainer style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Record ID</TableCell>
                            <TableCell>Pet ID</TableCell>
                            <TableCell>Veterinarian ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Operation</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {medicalRecords.map(record => (
                            <TableRow key={record.record_ID}>
                                <TableCell>{record.record_ID}</TableCell>
                                <TableCell>{record.pet_ID}</TableCell>
                                <TableCell>{record.veterinarian_ID}</TableCell>
                                <TableCell>{record.date.toDateString()}</TableCell>
                                <TableCell>{record.operation}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default LogMedicalRecord;

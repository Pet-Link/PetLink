import React from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from '@mui/material';
import medicalRecordModel from '../../models/medicalRecordMode';

const ViewPetMedicalRecords = () => {
    const medicalRecordInstance: medicalRecordModel = {
        pet_ID: 0,
        veterinarian_ID: 0,
        date: "",
        operation: "",
    };
    
    const [medicalRecords, setMedicalRecords] = React.useState<medicalRecordModel[]>([medicalRecordInstance]);

    return (
        <Grid container sx={{flexDirection:'column', display:'flex', justifyContent:'center', alignContent:'center', mt:5}}>
            <Typography variant="h4" gutterBottom>
                Pet Medical Records
            </Typography>
            <Grid item sx={{width:'60%'}}>
                <Paper>
                {medicalRecords.length === 0 ? (
                    <Typography variant="body1">No medical records found.</Typography>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Pet Name</TableCell>
                                    <TableCell>Operation</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Vet ID</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {medicalRecords.map((record) => (
                                    <TableRow key={record.record_ID}>
                                        <TableCell>{record.pet_name}</TableCell>
                                        <TableCell>{record.operation}</TableCell>
                                        <TableCell>{record.date}</TableCell>
                                        <TableCell>{record.veterinarian_ID}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default ViewPetMedicalRecords;

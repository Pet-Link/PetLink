import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper, Button ,Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import medicalRecordModel from '../../models/medicalRecordModel';
import { MedicalRecordService } from '../../services/medicalRecordService';
import toastr from 'toastr';

const ViewPetMedicalRecords = () => {
    const [medicalRecords, setMedicalRecords] = useState<medicalRecordModel[]>([]);


    const fetchMedicalRecords = async () => {
        try {
            const adopter_ID = parseInt(localStorage.getItem("user_ID") || "0");
            const response = await MedicalRecordService.getAllMedicalRecordsByAdopter(adopter_ID);
            if (response.status === 404) {
                setMedicalRecords([]);
                toastr.info("You do not have any medical records.");
                return;
            }
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data: medicalRecordModel[] = await response.json();
            setMedicalRecords(data);
        } catch (error) {
            console.error("There was an error fetching the medical records for the adopter:", error);
        }
    };


    useEffect(() => {
        fetchMedicalRecords();
    }, []);


    return (
        <Grid container sx={{ flexDirection: 'column', display: 'flex', justifyContent: 'center', alignContent: 'center', mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Pet Medical Records
            </Typography>
            <Grid item sx={{ width: '80%' }}>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Pet Name</TableCell>
                                <TableCell>Operation</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Veterinarian Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {medicalRecords.map((record) => (
                                <TableRow key={record.record_ID}>
                                    <TableCell>{record.pet_name}</TableCell>
                                    <TableCell>{record.operation}</TableCell>
                                    <TableCell>{record.date}</TableCell>
                                    <TableCell>{record.veterinarian_name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>
        </Grid>
    );
};


export default ViewPetMedicalRecords;

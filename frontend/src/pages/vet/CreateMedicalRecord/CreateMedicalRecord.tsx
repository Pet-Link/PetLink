import React, { useEffect, useState } from 'react';
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
    IconButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import medicalRecordModel from "../../../models/medicalRecordModel";
import toastr from 'toastr';
import { useNavigate } from 'react-router';
import { MedicalRecordService } from '../../../services/medicalRecordService';

const LogMedicalRecord: React.FC = () => {
    const navigate = useNavigate();
    const [medicalRecords, setMedicalRecords] = useState<medicalRecordModel[]>([]);

    // NOTE: this is the format that MySQL expects
    const formatDateToMySQL = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    
    const [medicalRecord, setMedicalRecord] = useState<medicalRecordModel>({
        record_ID: 0,
        pet_ID: 0,
        veterinarian_ID: 0,
        date: formatDateToMySQL((new Date)),
        operation: '',
        pet_name: '', // pet name can be added to the table
    });

    const fetchMedicalRecords = () => {
        // local storage is used to store the veterinarian ID
        var vet_ID = localStorage.getItem('user_ID');
        if (vet_ID != null) {
            MedicalRecordService.getAllMedicalRecordsByVeterinarian(parseInt(vet_ID)).then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        setMedicalRecords(data);
                    });
                } else {
                    toastr.error('Error fetching medical records');
                }
            });
        } else {
            toastr.error('Please login first!');
        }
    }


    useEffect(() => {
        fetchMedicalRecords();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMedicalRecord(prevState => ({ ...prevState, [name]: value }));
    };

    const handleLogRecord = () => {
        // Add logic to send the medical record data to the server or perform any required actions
        console.log('Logging Medical Record:', medicalRecord);
        // get the veterinarian ID from the local storage
        var vet_id = localStorage.getItem('user_ID');
        if (vet_id != null) {
            medicalRecord.veterinarian_ID = parseInt(vet_id);
        }

        if (!medicalRecord.operation.trim()) {
            toastr.error('Please explain the operation for this record.');
            return;
        }
        medicalRecord.date = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' });

        MedicalRecordService.createMedicalRecord(medicalRecord).then((response) => {
            if (response.ok) {
                toastr.success('Medical Record Logged Successfully');
                fetchMedicalRecords();
            } else {
                response.text().then((data) => {
                    toastr.error(data);
                }
                );
            }
        });
    };

    const handleDelete = (record_ID: number) => {
        MedicalRecordService.deleteMedicalRecord(record_ID).then((response) => {
            if (response.ok) {
                toastr.success('Medical Record Deleted Successfully');
                // Update the list of medical records with the new record
                fetchMedicalRecords();
            } else {
                response.text().then((data) => {
                    toastr.error(data);
                }
                );
            }
        });
    }

    // Function to handle the "Go Back Home" action
    const goBackHome = () => {
        navigate('/veterinarian/home');
    };

    return (
        <Container>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h4" gutterBottom>
                        Log Medical Record
                    </Typography>
                </Grid>
                <Grid item>
                    <IconButton onClick={goBackHome}>
                        <HomeIcon />
                    </IconButton>
                </Grid>
            </Grid>
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
                            <TableCell>Log Date</TableCell>
                            <TableCell>Operation</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {medicalRecords.map(record => (
                            <TableRow key={record.record_ID}>
                                <TableCell>{record.record_ID}</TableCell>
                                <TableCell>{record.pet_ID}</TableCell>
                                <TableCell>{record.veterinarian_ID}</TableCell>
                                <TableCell>{record.date}</TableCell>
                                <TableCell>{record.operation}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{ backgroundColor: "red" }}
                                        onClick={() => record.record_ID && handleDelete(record.record_ID)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default LogMedicalRecord;

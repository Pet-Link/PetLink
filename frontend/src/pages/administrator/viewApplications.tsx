import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid, Button } from '@mui/material';
import { adoptionApplicationService } from '../../services/adoptionApplicationService';

interface Application {
    admin_remarks: string | null;
    administrator_ID: number;
    adopter_ID: number;
    adopter_name: string;
    adoption_reason: string;
    approval_status: number | null;
    date: string; // You might want to convert this to a Date object when using it
    housing_situation: string;
    pet_ID: number;
    pet_name: string;
    pet_care_experience: number;
    pet_ownership: number;
    shelter_name: string;
}

const ViewApplications: React.FC = () => {

    const [applications, setApplications] = useState<Application[]>([]);

    const fetchApplications = async () => {
        try {
            const response = await adoptionApplicationService.seeAdminApplications();
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data: Application[] = await response.json();
            setApplications(data);
        } catch (error) {
            console.error("There was an error fetching the applications:", error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []); // The empty array as a second argument ensures this effect runs once on mount


    return (
        <Grid sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 20, 
            mb: 5
        }}>
            <Typography variant="h4" sx={{ mb: 4 }}>List of Applications</Typography>
            <TableContainer component={Paper} sx={{ maxWidth: '80%', margin: 'auto' }}>
                <Table sx={{minWidth: 500}} aria-label="applications table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Submission Date</TableCell>
                            <TableCell>Adopter</TableCell>
                            <TableCell>Shelter</TableCell>
                            <TableCell>Pet</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.map((application, index) => (
                            <TableRow key={index}>
                                <TableCell>{application.date}</TableCell>
                                <TableCell>{application.adopter_name}</TableCell>
                                <TableCell>{application.shelter_name}</TableCell>
                                <TableCell>{application.pet_name}</TableCell>
                                <TableCell>
                                    {application.approval_status === null ? 'Unevaluated' :
                                    application.approval_status === 1 ? 'Approved' : 'Rejected'} 
                                </TableCell>
                                <TableCell><Button color='secondary' variant='contained' size='small'>See Details</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
};



export default ViewApplications;


import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid, Button, IconButton } from '@mui/material';
import { adoptionApplicationService } from '../../services/adoptionApplicationService';
import { useNavigate } from 'react-router-dom';
import applyAdoptModel from '../../models/applyAdoptModel';
import toastr from 'toastr';
import HomeIcon from '@mui/icons-material/Home';

const ViewApplications: React.FC = () => {

    const [applications, setApplications] = useState<applyAdoptModel[]>([]);
    const navigate = useNavigate();

    const fetchApplications = async () => {
        try {
            const response = await adoptionApplicationService.getAdminApplications();
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data: applyAdoptModel[] = await response.json();
            setApplications(data);
        } catch (error) {
            console.error("There was an error fetching the applications:", error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);


    const handleSeeDetails = (adopter_ID: number, pet_ID: number) => {
        navigate('/administrator/see-application-detail', { state: { adopter_ID: adopter_ID, pet_ID: pet_ID } });
    }

    const goBackHome = () => {
        navigate('/administrator/home');
    }

    return (
        <Grid sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 20, 
            mb: 5
        }}>
                    <Typography variant="h4" gutterBottom>
                        Manage Appointments
                    </Typography>
            <TableContainer component={Paper} sx={{ maxWidth: '80%', margin: 'auto' }}>
                <Table sx={{minWidth: 500}} aria-label="applications table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Submission Date</TableCell>
                            <TableCell>Adopter</TableCell>
                            <TableCell>Adopter ID</TableCell>
                            <TableCell>Shelter</TableCell>
                            <TableCell>Pet</TableCell>
                            <TableCell>Pet ID</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.map((application, index) => (
                            <TableRow key={index}>
                                <TableCell>{application.date}</TableCell>
                                <TableCell>{application.adopter_name}</TableCell>
                                <TableCell>{application.adopter_ID}</TableCell>
                                <TableCell>{application.shelter_name}</TableCell>
                                <TableCell>{application.pet_name}</TableCell>
                                <TableCell>{application.pet_ID}</TableCell>
                                <TableCell>
                                    {application.approval_status === null ? 'Unevaluated' :
                                    application.approval_status === 1  ? 'Approved' : 'Rejected'} 
                                </TableCell>
                                <TableCell><Button color='secondary' variant='contained' size='small' onClick={() => handleSeeDetails(application.adopter_ID, application.pet_ID)}>See Details</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
};



export default ViewApplications;


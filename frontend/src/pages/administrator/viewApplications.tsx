import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid, Button } from '@mui/material';

const ViewApplications: React.FC = () => {
    // Example data
    const applications = [
        { adopter: 'John Doe', submissionDate: '2022-01-01', petId: '123', status: 'Pending' },
        { adopter: 'Jane Smith', submissionDate: '2022-01-02', petId: '456', status: 'Approved' },
        { adopter: 'Mike Johnson', submissionDate: '2022-01-03', petId: '789', status: 'Rejected' },
    ];

    return (
        <Grid sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 20, 
            mb: 5
        }}>
            <Typography variant="h4">List of Applications</Typography>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 500}} aria-label="applications table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Adopter</TableCell>
                            <TableCell>Submission Date</TableCell>
                            <TableCell>Pet ID</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.map((application, index) => (
                            <TableRow key={index}>
                                <TableCell>{application.adopter}</TableCell>
                                <TableCell>{application.submissionDate}</TableCell>
                                <TableCell>{application.petId}</TableCell>
                                <TableCell>{application.status}</TableCell>
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


import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Grid, Typography } from '@mui/material';

interface MeetAndGreet {
    id: number;
    date: string;
    petName: string;
    shelter: string;
}

const ViewMeetAndGreets: React.FC = () => {
    const meetAndGreets: MeetAndGreet[] = [
        { id: 1, date: '2022-01-01', petName: 'Fluffy', shelter: 'ABC Shelter' },
        { id: 2, date: '2022-01-02', petName: 'Buddy', shelter: 'XYZ Shelter' },
        // Add more meet and greet data here
    ];

    const handleViewDetail = (id: number) => {
        // Navigate to detailsOfPetToAdoptAdopter page with the corresponding pet ID
        // Implement your navigation logic here
    };

    return (
        <Grid sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 10, 
            mb: 5
        }}>
        <Typography variant="h4" gutterBottom>View Meet and Greets</Typography>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Pet Name</TableCell>
                        <TableCell>Shelter</TableCell>
                        <TableCell>View Detail</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {meetAndGreets.map((meetAndGreet) => (
                        <TableRow key={meetAndGreet.id}>
                            <TableCell>{meetAndGreet.date}</TableCell>
                            <TableCell>{meetAndGreet.petName}</TableCell>
                            <TableCell>{meetAndGreet.shelter}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleViewDetail(meetAndGreet.id)}>View Detail</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </Grid>
    );
};

export default ViewMeetAndGreets;

import React, {useState, useEffect} from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Grid, Typography } from '@mui/material';
import meetGreetModel from '../../models/meetGreetModel';
import { meetGreetService } from '../../services/meetGreetService';
import toastr from 'toastr';

const ViewMeetAndGreets: React.FC = () => {

    const [meetAndGreets, setMeetAndGreets] = useState<meetGreetModel[]>([]);
    
    const fetchApplications = async () => {
        try {
            const adopter_ID = parseInt(localStorage.getItem("user_ID") || "");
            const response = await meetGreetService.getAllMeetGreetAdopter(adopter_ID);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data: meetGreetModel[] = await response.json();
            setMeetAndGreets(data);
        } catch (error) {
            toastr.error("There was an internal system error.");
            console.error("There was an error fetching the applications:", error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);


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
        <TableContainer style={{ width: '80%' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Pet Name</TableCell>
                        <TableCell>Shelter</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {meetAndGreets.map((meetAndGreet) => (
                        <TableRow key={meetAndGreet.pet_ID}>
                            <TableCell>{meetAndGreet.date}</TableCell>
                            <TableCell>{meetAndGreet.pet_name}</TableCell>
                            <TableCell>{meetAndGreet.shelter_name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </Grid>
    );
};

export default ViewMeetAndGreets;

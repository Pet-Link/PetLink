import React, {useState, useEffect} from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Grid, Typography } from '@mui/material';
import meetGreetModel from '../../models/meetGreetModel';
import { meetGreetService } from '../../services/meetGreetService';
import toastr from 'toastr';

const ViewMeetAndGreets: React.FC = () => {

    const [meetAndGreets, setMeetAndGreets] = useState<meetGreetModel[]>([]);
    
    const fetchMeetGreets = async () => {
        try {
            const adopter_ID = parseInt(localStorage.getItem("user_ID") || "0");
            const response = await meetGreetService.getAllMeetGreetAdopter(adopter_ID);
            if (response.status === 404) {
                setMeetAndGreets([]);
                toastr.info("You do not have any meet and greet appointments.");
                return;
            }
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data: meetGreetModel[] = await response.json();
            setMeetAndGreets(data);
        } catch (error) {
            toastr.error("There was an internal system error.");
            console.error("There was an error fetching the meet and greets for the adopter:", error);
        }
    };

    useEffect(() => {
        fetchMeetGreets();
    }, []);

    const handleDelete = (adopter_ID: number, pet_ID: number, pet_name?: string) => {
        meetGreetService.deleteMeetGreet(adopter_ID, pet_ID).then((response) => {
            if (response.ok) {
                const successMessage = pet_name
                ? `Meet and Greet for ${pet_name} is successfully deleted.`
                : 'Meet and Greet is successfully deleted.';
                toastr.success(successMessage);
                fetchMeetGreets();
            } else {
                response.text().then((text) => {
                    try {
                        toastr.error("Failed to delete meet and greet.");
                        console.error(text);
                    } catch (error) {
                        console.error('Invalid JSON:', text);
                    }
                });
            }
        }
        );
    }

    console.log("Here");
    console.log(meetAndGreets);
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
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {meetAndGreets.map((meetAndGreet, index) => (
                        <TableRow key={index}>
                            <TableCell>{meetAndGreet.date}</TableCell>
                            <TableCell>{meetAndGreet.pet_name}</TableCell>
                            <TableCell>{meetAndGreet.shelter_name}</TableCell>
                            <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{ backgroundColor: "red" }}
                                        onClick={() => handleDelete(meetAndGreet.adopter_ID, meetAndGreet.pet_ID, meetAndGreet.pet_name)}
                                    >
                                        Delete
                                    </Button>
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

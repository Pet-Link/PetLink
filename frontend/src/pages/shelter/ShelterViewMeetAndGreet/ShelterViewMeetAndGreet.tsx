import React, {useState, useEffect} from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Button,
} from '@mui/material';
import meetGreetModel from '../../../models/meetGreetModel';
import { meetGreetService } from '../../../services/meetGreetService';
import toastr from 'toastr';

const ShelterViewMeetAndGreet: React.FC = () => {

    const [meetAndGreets, setMeetAndGreets] = useState<meetGreetModel[]>([]);

    const fetchMeetGreets = async () => {
        try {
            const shelter_ID = parseInt(localStorage.getItem("user_ID") || "0");
            const response = await meetGreetService.getAllMeetGreetShelter(shelter_ID);
            if (response.status === 404) {
                setMeetAndGreets([]);
                toastr.info("This shelter does not have any meet and greet appointments.");
                return;
            }
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data: meetGreetModel[] = await response.json();
            setMeetAndGreets(data);
        } catch (error) {
            toastr.error("There was an internal system error.");
            console.error("There was an error fetching the meet and greets for the shelter:", error);
        }
    };

    useEffect(() => {
        fetchMeetGreets();
    }, []);

    const handleDelete = (adopter_ID: number, pet_ID: number, adopter_name?: string) => {
        meetGreetService.deleteMeetGreet(adopter_ID, pet_ID).then((response) => {
            if (response.ok) {
                const successMessage = adopter_name
                ? `Meet and Greet for ${adopter_name} is successfully deleted.`
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

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom sx={{mt: 5, mb: 5}}>
                Meet and Greets
            </Typography>
            <Grid container spacing={2}>
                {meetAndGreets.map((meetGreet, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                        <Card>
                            <CardHeader
                                title={`Adopter: ${meetGreet.adopter_name}`}
                                subheader={`Pet: ${meetGreet.pet_name}`}
                            />
                            <CardContent>
                                <Typography variant="body1" color="textSecondary" gutterBottom>
                                    Adopter's e-mail: {meetGreet.adopter_e_mail ? meetGreet.adopter_e_mail : "Not given"}
                                </Typography>
                                <Typography variant="body1" color="textSecondary" gutterBottom>
                                    Date: {meetGreet.date}
                                </Typography>
                                <div style={{ display: 'flex', justifyContent: 'center'}}>
                                    <Button
                                    variant="contained"
                                    color="secondary"
                                    style={{ backgroundColor: "red" }}
                                    onClick={() => handleDelete(meetGreet.adopter_ID, meetGreet.pet_ID, meetGreet.adopter_name)}
                                    >
                                    Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ShelterViewMeetAndGreet;

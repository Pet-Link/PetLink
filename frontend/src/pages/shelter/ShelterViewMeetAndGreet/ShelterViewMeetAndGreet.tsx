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

const ShelterViewMeetAndGreet: React.FC = () => {
    const [meetGreets, setMeetGreets] = useState<meetGreetModel[]>([
        //mockups
        //{adopter_ID: 1, pet_ID: 101, date: '2023-07-10'},
        //{adopter_ID: 2, pet_ID: 102, date: '2023-07-15'},
        //{adopter_ID: 3, pet_ID: 103, date: '2023-07-20'},
        // Add more sample meet and greet data as needed
    ]);

    useEffect(() => {
        // Fetch meet and greet data when the component mounts
        fetchMeetGreets();
    }, []);

    const fetchMeetGreets = async () => {
        try {
            //TODO: connecting, there is no getMeetGreets() in service
            // Assuming getMeetGreets is a function that fetches meet and greet data from the server
            //const meetGreetsData = await getMeetGreets();
            //setMeetGreets(meetGreetsData);
        } catch (error) {
            console.error('Error fetching meet and greets:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Meet and Greets
            </Typography>
            <Grid container spacing={2}>
                {meetGreets.map((meetGreet, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                        <Card>
                            <CardHeader
                                title={`Adopter ID: ${meetGreet.adopter_ID}`}
                                subheader={`Pet ID: ${meetGreet.pet_ID}`}
                            />
                            <CardContent>
                                <Typography variant="body1" color="textSecondary" gutterBottom>
                                    Date: {meetGreet.date}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ShelterViewMeetAndGreet;

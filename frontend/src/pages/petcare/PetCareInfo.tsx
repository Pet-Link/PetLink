import React, {useState} from 'react';
import {
    AppBar,
    Container,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Paper,
    Button,
    CardActions, Grid, DialogActions, DialogTitle, Dialog, DialogContent
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import {ArrowUpward, ChatBubbleOutline, Share} from '@mui/icons-material';
import TextField from "@mui/material/TextField";
import petCareInfoModel from '../../models/petCareInfoModel';

const PetCareInfo = () => {
    // Mock data for posts
    //TODO: retrieve pet care info from be
    const [posts, setPosts] = useState<petCareInfoModel[]>([
        {
            info_ID: 1,
            content: 'Proper nutrition is vital for your furry friends\' well-being. As responsible pet owners, it\'s crucial to understand the dietary needs of our pets to ensure they lead healthy and happy lives. Providing a balanced and nutritious diet supports their growth, strengthens their immune system, and maintains overall vitality. Consult your veterinarian to tailor a diet that suits your pet\'s breed, age, and health conditions. Remember, a well-fed pet is a content and thriving companion.',
            title: 'The Essentials of Pet Nutrition',
            administrator_ID: 101,
        },
        {
            info_ID: 2,
            content: 'Ensuring a safe environment is fundamental to caring for your beloved pets. Make your home pet-friendly by eliminating potential hazards. Secure toxic substances, keep electrical cords out of reach, and create a comfortable space with their bed and toys. Regular veterinary check-ups, vaccinations, and parasite prevention are essential. Provide mental and physical stimulation through play and exercise. By fostering a secure and stimulating atmosphere, you contribute to the overall well-being and happiness of your four-legged family members.',
            title: 'Creating a Safe Haven for Your Pet at Home',
            administrator_ID: 102,
        },
    ]);

    return (
        <div>
            <CssBaseline/>
            <Grid item xs={12}>
                <Typography variant="h4" align="center" gutterBottom>
                    Pet Care Informations
                </Typography>
            </Grid>
            <Toolbar/>
            <Container sx={{display: 'flex'}}>

                <main>
                    {posts.map((post) => (
                        <Card key={post.title} sx={{mb: 2}}>
                            <CardContent>
                                <Typography variant="h6">{post.title}</Typography>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Posted by Administrator No: {post.administrator_ID}
                                </Typography>
                                <Typography paragraph>{post.content}</Typography>
                            </CardContent>
                            <Divider/>
                            <CardActions>
                                <Button startIcon={<Share/>} size="small">Share</Button>
                            </CardActions>
                        </Card>
                    ))}
                </main>
            </Container>
        </div>
    );
};

export default PetCareInfo;


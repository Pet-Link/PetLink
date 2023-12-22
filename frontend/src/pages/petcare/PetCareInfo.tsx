import React, {useState, useEffect} from 'react';
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
import { PetCareInfoService } from '../../services/petCareInfoService';
import toastr from 'toastr';

const PetCareInfo = () => {
    // Mock data for posts
    //TODO: retrieve pet care info from be
    const [posts, setPosts] = useState<petCareInfoModel[]>([]);

    const fetchPetCareInfo = async () => {
        try {
            const response = await PetCareInfoService.getAllPetCareInfo();

            if (response.status === 404) {
                // Handle the case where there are no posts
                setPosts([]);
                toastr.info("There are no pet care posts available at this time.");
                return;
            }

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            
            const data: petCareInfoModel[] = await response.json();
            setPosts(data);
        } catch (error) {
            toastr.error("There was an internal system error.");
            console.error("There was an error fetching the applications:", error);
        }
    };

    useEffect(() => {
        fetchPetCareInfo();
    }, []);

    const handleShareClick = (postContent: string) => {
        navigator.clipboard.writeText(postContent).then(() => {
          toastr.success('Content copied to clipboard!');
        }, (err) => {
          toastr.error('Could not copy text: ', err);
        });
    };

    const handleDeletePost = async (info_ID: number) => {
        PetCareInfoService.deletePetCareInfo(info_ID).then(async (response) => {
            if (response.ok) {
                toastr.success("Pet care information successfully deleted.");
                await fetchPetCareInfo();
            } else {
                response.text().then((text) => {
                    try {
                    toastr.error('Failed to delete Pet care information.');
                    console.log(text);
                    } catch (error) {
                        console.error('Invalid JSON:', text);
                    }
                });
            }
        }
        );
    }

    return (
        <div>
            <CssBaseline/>
            <Grid item xs={12}>
                <Typography variant="h4" align="center" gutterBottom sx={{mt:5}}>
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
                                    Posted by Administrator: {post.administrator_name ? post.administrator_name : post.administrator_ID}
                                </Typography>
                                <Typography paragraph>{post.content}</Typography>
                            </CardContent>
                            <Divider/>
                            <CardActions>
                                <Button
                                    startIcon={<Share/>}
                                    size="small"
                                    onClick={() => handleShareClick(`${post.title}\n\n${post.content}`)} 
                                >
                                    Share
                                </Button>
                                {localStorage.getItem("user_ID") === String(post.administrator_ID) && (
                                    <Button
                                        variant="contained"
                                        style={{ backgroundColor: "red" }}
                                        onClick={(event) => {
                                            event.stopPropagation(); // Prevents the CardContent onClick from being triggered
                                            handleDeletePost(post.info_ID);
                                        }}
                                    >
                                        Delete Post
                                    </Button>
                                )}
                            </CardActions>
                            
                        </Card>
                    ))}
                </main>
            </Container>
        </div>
    );
};

export default PetCareInfo;


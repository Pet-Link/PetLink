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
import { ArrowUpward, ChatBubbleOutline, Share } from '@mui/icons-material';
import TextField from "@mui/material/TextField";
import postModel from '../../models/postModel';
import { forumService } from '../../services/forumService';
import toastr from 'toastr';

const Forum = () => {
    // Mock data for posts
    const [posts, setPosts] = useState<postModel[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '' });

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };
    const handleCreatePost = () => {
        // Create a new post object
        const newPostObject: postModel = {
            title: newPost.title,
            content: newPost.content,
            post_date: '',
            poster_ID: (parseInt(localStorage.getItem('user_ID') || '0')).toString(),
            post_ID: "0",
        };
        if (parseInt(localStorage.getItem('user_ID') || '0') === 0) {
            toastr.error("You must be logged in to create a post!");
            return;
        }
        // Send the post object to the backend
        forumService.createPost(newPostObject).then((response) => {
            if (response.ok) {
                toastr.success('Post created successfully!');
                // If the post was created successfully, fetch the posts again
                forumService.getAllPosts().then((response) => {     

                    if (response.ok) {
                    response.json().then((data) => {
                        setPosts(data);
                    });

                    setOpenDialog(false);
                    setNewPost({ title: '', content: '' });
                    }
                });
            } else {
                response.text().then((data) => {
                    toastr.error("Post creation failed with error: " + data);
                });
            }
        }).catch(error => {
            // Handle any errors that occur during the post creation
            toastr.error("An error occurred while creating the post: " + error.message);
        });
    };
    

    const handleFetch = () => {
        forumService.getAllPosts().then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setPosts(data);
                });
            }
        }
        );
    }

    return (
        <div>
            <CssBaseline />
            <Grid item xs={12}>
                <Typography variant="h4" align="center" gutterBottom>
                    Petlink Forum
                </Typography>
            </Grid>
            <Toolbar />
            <Container sx={{ display: 'flex' }}>

                <main>
                    {posts.map((post) => (
                        <Card key={post.post_ID} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{post.title}</Typography>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Posted by {post.poster_name} {post.post_date}
                                </Typography>
                                <Typography paragraph>{post.content}</Typography>
                            </CardContent>
                            <Divider />
                            <CardActions>
                                <Button startIcon={<Share />} size="small">Share</Button>
                            </CardActions>
                        </Card>
                    ))}
                </main>
            </Container>
            <div style={{ position: 'fixed', bottom: 20, right: 20 }}>
                <Button variant="contained" color="secondary" onClick={handleDialogOpen}>
                    Create Post
                </Button>
                <Button variant="contained" color="secondary" onClick={handleFetch}>
                    Fetch Forum
                </Button>
            </div>
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Create a New Post</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Title"
                        value={newPost.title}
                        onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Content"
                        value={newPost.content}
                        onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleCreatePost} variant="contained" color="primary">
                        Post
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Forum;

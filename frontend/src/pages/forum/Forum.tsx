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

const Forum = () => {
    // Mock data for posts
    const [posts, setPosts] = useState([
        {
            id: 1,
            user: 'Kardelen Ceren',
            timeAgo: '23 hours ago',
            title: 'Seeking Advice on Choosing the Perfect Furry Companion',
            content: 'I\'ve been pondering the idea of adopting a pet lately, and the multitude of adorable faces on PetLink is making it a tough decision. Could use some guidance from those who\'ve been through the adoption process. How did you decide on the right furry friend for your family? Did you have specific criteria or a checklist while browsing profiles?...',
            comments: 17,
            upvotes: 42,
        },
        {
            id: 2,
            user: 'Alperen Yılmazyıldız',
            timeAgo: '6 hours ago',
            title: 'Pet Healthcare Real Talk: Navigating the Ups and Downs',
            content: 'I\'m not gonna lie; this whole pet healthcare thing has me feeling like I\'m on the struggle bus. From figuring out what\'s in their food to...',
            category: 'Medical',
            comments: 149,
            upvotes: 96,
        },
    ]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '' });

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleCreatePost = () => {
        // TODO: Handle creating a new post (e.g., send data to the backend)
        // For now, just add a new post to the state
        setPosts((prevPosts) => [
            ...prevPosts,
            {
                id: prevPosts.length + 1,
                user: 'CurrentUser', // TODO: Replace with actual user information
                timeAgo: 'just now',
                title: newPost.title,
                content: newPost.content,
                comments: 0,
                upvotes: 0,
            },
        ]);
        // Close the dialog and clear the input fields
        setOpenDialog(false);
        setNewPost({ title: '', content: '' });
    };
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
                        <Card key={post.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{post.title}</Typography>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Posted by {post.user} {post.timeAgo}
                                </Typography>
                                <Typography paragraph>{post.content}</Typography>
                            </CardContent>
                            <Divider />
                            <CardActions>
                                <Button startIcon={<ArrowUpward />} size="small">{post.upvotes}</Button>
                                <Button startIcon={<ChatBubbleOutline />} size="small">{post.comments}</Button>
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

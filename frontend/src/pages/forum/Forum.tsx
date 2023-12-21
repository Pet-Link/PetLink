import React, {useEffect, useState} from 'react';
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
import replyModel from '../../models/replyModel';

const Forum = () => {
    // Mock data for posts
    const [posts, setPosts] = useState<postModel[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [reply, setReply] = useState({ content: '' });
    const [replies, setReplies] = useState<replyModel[]>([]);
    const [openReply, setOpenReply] = useState(false);

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
                // forumService.getAllPosts().then((response) => {     

                //     if (response.ok) {
                //     response.json().then((data) => {
                //         setPosts(data);
                //     });

                //     
                //     
                //     }
                // });
                setPosts((prev) => [...prev, newPostObject]);
                setOpenDialog(false);
                setNewPost({ title: '', content: '' });
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

    useEffect(() => {
        handleFetch();
    }
    , []);
    

    const handleFetch = () => {
        forumService.getAllPosts().then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setPosts(data);
                });
            }
            }

        );
    
        //reply fetch edilecek
        /*posts.map((post) => {
            forumService.getAllRepliesForAPost(post.post_ID).then((response) => {
                console.log(response);
                if (response.ok) {
                    response.json().then((data) => {
                        setReplies(data);
                    });
                }
                });    
        });*/
    }

    const handleOpenReply = () => {
        setOpenReply(true);
    }   

    const handleCloseReply = () => {
        setOpenReply(false);
    }

    const handleReply = () => {
        const newReplyObject: replyModel = {
            content: reply.content,
            replier_ID: (parseInt(localStorage.getItem('user_ID') || '0')),
            post_ID: 1,
            expert_verify_status: localStorage.getItem('user_role') === 'veterinarian' ? true : false,
            date: new Date(),
            discriminator_ID: 0,
        };
        if (parseInt(localStorage.getItem('user_ID') || '0') === 0) {
            toastr.error("You must be logged in to create a post!");
            return;
        }
        forumService.createReply(newReplyObject).then((response) => {
            if (response.ok) {
                toastr.success('Reply created successfully!');
                // If the post was created successfully, fetch the posts again
                // forumService.getAllPosts().then((response) => {     

                //     if (response.ok) {
                //     response.json().then((data) => {
                //         setPosts(data);
                //     });

                //     
                //     
                //     }
                // });
                setReplies((prev) => [...prev, newReplyObject]);
                setOpenDialog(false);
                setNewPost({ title: '', content: '' });
            } else {
                response.text().then((data) => {
                    toastr.error("Reply creation failed with error: " + data);
                });
            }
        }).catch(error => {
            // Handle any errors that occur during the post creation
            toastr.error("An error occurred while creating the reply: " + error.message);
        });

    }

    return (
        <div>
            <CssBaseline />
            <Grid item xs={12} sx={{mt:3}}>
                <Typography variant="h4" align="center" gutterBottom>
                    Petlink Forum
                </Typography>
            </Grid>
            <Toolbar />
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Grid>
                    {posts.map((post) => (
                        <Card key={post.post_ID} sx={{ mb: 2, width: '50vw' }}>
                            <CardContent>
                                <Typography variant="h6">{post.title}</Typography>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Posted by {post.poster_name} {post.post_date}
                                </Typography>
                                <Typography paragraph>{post.content}</Typography>
                            </CardContent>
                            <Divider />
                            <CardContent>
                                <Typography>Replies</Typography>
                                {replies.map((reply) => (
                                    <div key={reply.discriminator_ID}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Expert verify status: {(reply.expert_verify_status === true ? 'Expert Answer ' : 'Not expert ')}{reply.date.toString()}
                                        </Typography>
                                        <Typography paragraph>{reply.content}</Typography>
                                    </div>
                                ))}
                            </CardContent>
                            <Divider />
                            <CardActions>
                                <Button startIcon={<Share />} size="small">Share</Button>
                                <Button startIcon={<ChatBubbleOutline />} onClick={handleOpenReply} size="small">Reply</Button>
                            </CardActions>
                        </Card>
                    ))}
                </Grid>
            </Container>
            <Dialog open={openReply} onClose={handleCloseReply} maxWidth="sm" fullWidth>
                <DialogTitle>Reply</DialogTitle>
                <DialogContent sx={{width: '100%'}} >
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Content"
                        value={reply.content}
                        onChange={(e) => setReply((prev) => ({ ...prev, content: e.target.value }))}              
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReply}>Cancel</Button>
                    <Button onClick={handleReply} variant="contained" color="primary">
                        Reply
                    </Button>
                </DialogActions>
            </Dialog>
            <div style={{ position: 'fixed', bottom: 20, right: 20 }}>
                <Button variant="contained" color="secondary" onClick={handleDialogOpen}>
                    Create Post
                </Button>
                {/* <Button variant="contained" color="secondary" onClick={handleFetch}>
                    Fetch Forum
                </Button> */}
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

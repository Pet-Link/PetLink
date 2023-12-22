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
    const [newReply, setNewReply] = useState({ post_ID: 0, content: '' });
    const [replies, setReplies] = useState<replyModel[]>([]);
    const [openReply, setOpenReply] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    const fetchPosts = async () => {
        try {
            const response = await forumService.getAllPosts();
            if (response.status === 404) {
                setPosts([]);
                response.text().then((text) => {
                    toastr.info(text);
                });
            } else if (!response.ok) {
                throw new Error('Network response was not ok.');
            } else {
                const data: postModel[] = await response.json();
                setPosts(data);
            }
        } catch (error) {
            toastr.error('Internal error fetching posts.');
            console.error('Error:', error);
        }  

    }

    const fetchRepliesForPost = async (post_ID: number) => {
        try {
            const response = await forumService.getAllRepliesForAPost(post_ID);
            if (response.status === 404) {
                setReplies([]);
                response.text().then((text) => {
                    toastr.info(text);
                });
            } else if (!response.ok) {
                throw new Error('Network response was not ok.');
            } else {
                const data: replyModel[] = await response.json();
                setReplies(data);
            }
        } catch (error) {
            toastr.error('Internal error fetching replies.');
            console.error('Error:', error);
        }  
    }

    useEffect(() => {
        fetchPosts();
    }
    , []);

    const handlePostClick = async (post_ID: number) => {
        setSelectedPostId(selectedPostId === post_ID ? null : post_ID); // when a selected post is clicked again, its replies are collapsed
        fetchRepliesForPost(post_ID);
    };

    const handleCreatePost = () => {
        // Create a new post object
        const newPostObject: postModel = {
            title: newPost.title,
            content: newPost.content,
            post_date: '',
            poster_ID: parseInt(localStorage.getItem('user_ID') || '0'),
            post_ID: 0,
        };
        if (parseInt(localStorage.getItem('user_ID') || '0') === 0) {
            toastr.error("You must be logged in to create a post!");
            return;
        }
        // Send the post object to the backend
        forumService.createPost(newPostObject).then(async (response) => {
            if (response.ok) {
                toastr.success('Post created successfully!');
                await fetchPosts();
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


    const handleCreateReply = () => {
        if (parseInt(localStorage.getItem('user_ID') || '0') === 0) {
            toastr.error("You must be logged in to create a reply!");
            return;
        }

        const newReplyObject: replyModel = {
            content: newReply.content,
            replier_ID: (parseInt(localStorage.getItem('user_ID') || '0')),
            post_ID: newReply.post_ID,
            expert_verify_status: localStorage.getItem('user_role') === 'veterinarian' ? true : false,
            date: new Date(),
        };

        forumService.createReply(newReplyObject).then(async (response) => {
            if (response.ok) {
                toastr.success('Reply created successfully!');
                await fetchPosts();
                if (selectedPostId) {
                    await fetchRepliesForPost(selectedPostId);
                }
                setOpenReply(false);
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

    const handleDeletePost = async (post_ID: number) => {
        forumService.deletePost(post_ID).then(async (response) => {
            if (response.ok) {
                toastr.success("Post successfully deleted.");
                await fetchPosts();
                if (selectedPostId) {
                    fetchRepliesForPost(selectedPostId);
                }
            } else {
                response.text().then((text) => {
                    try {
                    toastr.error('Failed to delete post.');
                    console.log(text);
                    } catch (error) {
                        console.error('Invalid JSON:', text);
                    }
                });
            }
        }
        );
    }

    // Method to delete a reply
    const handleDeleteReply = async (post_ID: number, discriminator_ID: number) => {
        forumService.deleteReply(post_ID, discriminator_ID).then(async (response) => {
            if (response.ok) {
                toastr.success("Reply successfully deleted.");
                await fetchPosts();
                if (selectedPostId) {
                    fetchRepliesForPost(selectedPostId);
                }
            } else {
                response.text().then((text) => {
                    try {
                    toastr.error('Failed to delete reply.');
                    console.log(text);
                    } catch (error) {
                        console.error('Invalid JSON:', text);
                    }
                });
            }
        }
        );
    }

    const handleShareClick = (postContent: string) => {
        navigator.clipboard.writeText(postContent).then(() => {
          toastr.success('Content copied to clipboard!');
        }, (err) => {
          toastr.error('Could not copy text: ', err);
        });
    };
   
    const handleOpenReply = (post_ID: number) => {
        setNewReply((prev) => ({ ...prev, post_ID: post_ID}))
        setOpenReply(true);
    }   

    const handleCloseReply = () => {
        setOpenReply(false);
    }

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

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
                            <CardContent onClick={() => handlePostClick(post.post_ID)}>
                                <Typography variant="h6">{post.title}</Typography>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Posted by {post.poster_name} {post.post_date}
                                </Typography>
                                <Typography paragraph>{post.content}</Typography>
                                <Typography variant="subtitle2">
                                    {((post.reply_count || 0 ) > 0) ? `Click to see ${post.reply_count} Replies` : 'Be the first one to reply!'}
                                </Typography>

                                {localStorage.getItem("user_ID") === String(post.poster_ID) && (
                                    <Button
                                        variant="contained"
                                        style={{ backgroundColor: "red" }}
                                        onClick={(event) => {
                                            event.stopPropagation(); // Prevents the CardContent onClick from being triggered
                                            handleDeletePost(post.post_ID);
                                        }}
                                    >
                                        Delete Post
                                    </Button>
                                )}
                            </CardContent>
                            {selectedPostId === post.post_ID && (
                            <div> 
                                <Divider />
                                <CardContent>
                                    <Typography>Replies</Typography>
                                    {replies.map((reply) => (<CardContent style={{ background: reply.expert_verify_status ? '#e8f5e9' : '' }} >
                                        <div key={reply.discriminator_ID}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {reply.expert_verify_status ? (
                                                <>
                                                    <strong>Veterinarian Answer</strong>
                                                    <br />
                                                </>
                                            ) : null}
                                            Replied by {reply.replier_name}{' '}
                                            {reply.date.toString()}
                                        </Typography>
                                        <Typography paragraph>{reply.content}</Typography>
                                        {localStorage.getItem("user_ID") === String(reply.replier_ID) && (
                                        <Button
                                            variant="contained"
                                            style={{ backgroundColor: "red" }}
                                            onClick={(event) => {
                                                handleDeleteReply(post.post_ID, reply.discriminator_ID || 0);
                                            }}
                                        >
                                            Delete Reply
                                        </Button>
                                        )}
                                        </div>  </CardContent>
                                    ))}
                                </CardContent>
                                <Divider />
                            </div>
                            )}
                            <CardActions>
                                <Button startIcon={<Share />} size="small" onClick={() => handleShareClick(`${post.title}  \n${post.content}`)} >Share</Button>
                                <Button startIcon={<ChatBubbleOutline />} onClick={() => handleOpenReply(post.post_ID)} size="small">Reply</Button>
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
                        value={newReply.content}
                        onChange={(e) => setNewReply((prev) => ({ ...prev, content: e.target.value }))}              
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReply}>Cancel</Button>
                    <Button onClick={handleCreateReply} variant="contained" color="primary">
                        Reply
                    </Button>
                </DialogActions>
            </Dialog>
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

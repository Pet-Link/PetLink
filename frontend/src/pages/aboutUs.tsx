import React from 'react';
import { Grid, Typography, Paper, CssBaseline, Link } from '@mui/material';

export default function AboutUs() {
    return (
        <Grid
            container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 6,
                mt: 10,
            }}
        >
            <CssBaseline />
            <Paper sx={{ p: 5, borderRadius: '15px', maxWidth: '600px' }}>
                <Typography fontSize={'24px'} mt="16px" textAlign="center">
                    About PetLink
                </Typography>
                <Typography fontSize={'18px'} mt="16px" textAlign="justify">
                    PetLink is a dedicated platform that connects pet lovers with various services and communities. Our mission is to provide a seamless and interactive experience for pet adopters, veterinarians, shelters, and administrators alike. With PetLink, you can find the perfect companion, seek expert advice, and become part of a larger community that celebrates the joy pets bring into our lives.
                </Typography>
                <Typography fontSize={'18px'} mt="16px" textAlign="justify">
                    Our platform is designed with love and care, ensuring that each pet finds a warm, loving home. We understand the importance of the bond between pets and their owners, which is why we strive to offer the best services and support for every stage of your pet's life.
                </Typography>
                <Typography fontSize={'20px'} mt="16px" textAlign="center">
                    Contact Us
                </Typography>
                <Typography fontSize={'18px'} mt="8px" textAlign="center">
                    Have any questions or suggestions? We'd love to hear from you! Reach out to us at <Link href="mailto:petlink011@gmail.com">petlink011@gmail.com</Link>
                </Typography>
            </Paper>
        </Grid>
    );
}

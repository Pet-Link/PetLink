import React, { useState } from 'react';
import { TextField, Button, Typography, Link, Grid } from '@mui/material';
import { AuthenticationService } from '../../services/authenticationService';
import * as toastr from 'toastr';

const RegisterAdopter: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    
    
    const handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFullName(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleReEnterPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReEnterPassword(event.target.value);
    };

    const handleRegister = () => {
        if (password !== reEnterPassword) {
            toastr.error('Passwords do not match!');
            return;
        }
        // check if the phone number contains only digits
        if (phoneNumber.match(/\D/)) {
            toastr.error('Phone number should contain only digits!');
            return;
        }
        AuthenticationService.registerAdopter(fullName, email, password, phoneNumber).then((response) => {
            if (response.ok){
                toastr.success('Successfully registered!');
            } else {
                response.text().then((text) => {
                    toastr.error(text);
                });
            }
        }
        );
    };

    return (
        <Grid 
        sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 20, 
            mb: 5
        }}>
            <Typography sx={{mb:2}} fontSize={'30px'}>Adopter Registration</Typography>
            <TextField sx={{mb:2, width: '15vw'}} type="text" label="Full Name" size="small" value={fullName} onChange={handleFullNameChange} />
            <TextField sx={{mb:2, width: '15vw'}} type="email" label="Email" size="small" value={email} onChange={handleEmailChange} />
            <TextField sx={{mb:2, width: '15vw'}} type="tel" label="Phone Number" size="small" value={phoneNumber} onChange={handlePhoneNumberChange} />
            <TextField sx={{mb:2, width: '15vw'}} type="password" label="Password" size="small" value={password} onChange={handlePasswordChange} />
            <TextField sx={{mb:2, width: '15vw'}} type="password" label="Re-enter Password" size="small" value={reEnterPassword} onChange={handleReEnterPasswordChange} />
            <Button variant="outlined" color="success" onClick={handleRegister}>Register</Button>
            <Typography>
                Already have an account? <Link href="/">Login</Link>
            </Typography>
        </Grid>
    );
};

export default RegisterAdopter;


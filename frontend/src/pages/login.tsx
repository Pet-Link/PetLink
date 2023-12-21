import React, { useState } from 'react';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Typography,
    Link,
    Paper,
    CssBaseline
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import { AuthenticationService } from '../services/authenticationService';
import * as toastr from 'toastr';
import { useUserStore } from '../auth/Store';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registrationType, setRegistrationType] = useState('');

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleRegistrationTypeChange = (event: SelectChangeEvent) => {
        setRegistrationType(event.target.value as string);
    };

    const handleLogin = () => {
        AuthenticationService.login(email, password).then(
            function(result) {
                if (result.ok) {
                    result.text().then((text) => {
                        try {
                            const data = JSON.parse(text);
                            toastr.success('Login has been successful.');
                            useUserStore.getState().setUserType(data.user_role);
                            localStorage.setItem('user_ID', data.user_id);
                            localStorage.setItem('user_role', data.user_role);
                            navigate(`/${data.user_role}/home`);
                        } catch (error) {
                            console.error('Invalid JSON:', text);
                        }
                    });
                } else {
                    console.log(result);
                    result.text().then((text) => {
                        try {
                            toastr.error(text);
                        } catch (error) {
                            console.error('Invalid JSON:', text);
                        }
                    });
                }
            }
        );
    };

    const handleRegisterType = () => {
        if (!registrationType) {
            // Display an error if no registration type is selected
            toastr.error('Please select a registration type.');
        } else {
            // Navigate to the appropriate registration page if a type is selected
            navigate(`register-${registrationType}`);
        }
    };

    // Function to handle key press in the password field
    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return ( 
        <Grid
        container
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 6,
            mt: 20,
        }}  
        > 
            <CssBaseline />
            <Paper sx={{ p:5, borderRadius: '15px'}}>
                <Typography fontSize={'24px'} mt="16px">
                Welcome To PetLink! 
                </Typography> 
                <Typography fontSize={'20px'} mt="16px">
                Login To Your Account
                </Typography> 
                <Grid item 
                sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 5, 
                    mb: 5
                }} >
                    <TextField
                        label="Email"
                        value={email}
                        onChange={handleEmailChange}
                        sx={{ mb: 2 }}
                        size="small"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        onKeyPress={handleKeyPress} // Add this line
                        sx={{ mb: 2 }}
                        size="small"
                    />
                    <Link sx={{ mt: 2, mb:1, textDecoration: 'none' }} href="/forgot-password" variant="body2">
                    Forgot password?
                    </Link>
                    <Button variant="contained" color='primary' onClick={handleLogin} sx={{ mb: 6} }>Login</Button>
                    <FormControl sx={{ width: '12vw', mb:1 }} size="small">
                        <InputLabel>Register as</InputLabel>
                        <Select
                        value={registrationType}
                        onChange={handleRegistrationTypeChange}
                        >
                        <MenuItem value="adopter">Adopter</MenuItem>
                        <MenuItem value="veterinarian">Veterinarian</MenuItem>
                        <MenuItem value="shelter">Shelter</MenuItem>
                        <MenuItem value="administrator">Administrator</MenuItem>
                        </Select>
                        <Button sx={{mt: 2}} variant='contained' onClick={handleRegisterType}>Register</Button>
                    </FormControl>
                    
                </Grid>
            </Paper>
        </Grid>
    );
}


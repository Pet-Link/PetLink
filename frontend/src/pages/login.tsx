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
        // Handle login logic here 
        console.log(email);
        console.log(password);
        console.log(registrationType);
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
                        sx={{ mb: 2 }}
                        size="small"
                    />
                    <FormControl sx={{ width: '12vw', mb:2 }} size="small">
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
                        <Button sx={{mt: 2}} variant='contained' onClick={() => navigate(`register-${registrationType}`)}>Register</Button>
                    </FormControl>
                    <Link sx={{ mt: 2, mb:1, textDecoration: 'none' }} href="/forgot" variant="body2">
                    Forgot password?
                    </Link>
                    <Button variant="contained" color='primary' onClick={handleLogin}>Login</Button>
                </Grid>
            </Paper>
        </Grid>
    );
}


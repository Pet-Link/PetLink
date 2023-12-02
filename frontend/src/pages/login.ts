/*import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export default function Login(  ) {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registrationType, setRegistrationType] = useState('');

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleRegistrationTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setRegistrationType(event.target.value as string);
    };

    const handleLogin = () => {
        // Handle login logic here
    };

    return (
        <div>
        <TextField
            label="Email"
            value={email}
            onChange={handleEmailChange}
        />
        <TextField
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
        />
        <FormControl>
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
        </FormControl>
        <Button variant="contained" onClick={handleLogin}>Login</Button>
        </div>
    );
};*/



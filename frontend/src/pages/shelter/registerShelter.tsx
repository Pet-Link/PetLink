import React, { useState } from 'react';
import { TextField, Button, Typography, Link, Grid, Stack } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import toastr from 'toastr';
import { AuthenticationService } from '../../services/authenticationService';

const RegisterShelter: React.FC = () => {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [verificationDocument, setVerificationDocument] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [buttonText, setButtonText] = useState('Choose File');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [country, setCountry] = useState('');
    const [buildingNo, setBuildingNo] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [shelterName, setShelterName] = useState('');
    const [description, setDescription] = useState('');
    

    const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement> ) => {
        event.preventDefault();
        
        const files = event.target.files;

        if (files && files.length > 0) {
            setButtonText(files[0].name);
          } else {
            setButtonText('Choose File');
          }
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    }

    const handleShelterNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShelterName(event.target.value);
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

    const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStreet(event.target.value);
    };  

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    };  

    const handleDistrictChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDistrict(event.target.value);
    };  

    const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCountry(event.target.value);
    };  

    const handleBuildingNoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBuildingNo(event.target.value);
    };  

    const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setZipCode(event.target.value);
    };  

    const handleVerificationDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setVerificationDocument(file);
            setFileName(file.name);
        }
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
        // check if the zip code is a valid one
        if (isNaN(Number(zipCode))) {
            toastr.error('Zip code must contain only digits!');
            return;
        }
        AuthenticationService.registerShelter(shelterName, email, password, phoneNumber, street, district, city, country, buildingNo, zipCode, description)
            .then((response) => {
                toastr.success('Shelter registered successfully');
            })
            .catch((error) => {
                toastr.error(error.response.data.message);
            });
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
            <Typography sx={{mb:2}} fontSize={'30px'}>Shelter Registration</Typography>
            <Stack direction="row" justifyContent="center" alignItems="flex-start" spacing={2}>
            <Grid sx={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 5
            }}>
                <TextField sx={{mb:2}} type="text" label="Street" size="small" value={street} onChange={handleStreetChange} />
                <TextField sx={{mb:2}} type="text" label="City" size="small" value={city} onChange={handleCityChange} />
                <TextField sx={{mb:2}} type="text" label="District" size="small" value={district} onChange={handleDistrictChange} />
                <TextField sx={{mb:2}} type="text" label="Country" size="small" value={country} onChange={handleCountryChange} />
                <TextField sx={{mb:2}} type="text" label="Building Number" size="small" value={buildingNo} onChange={handleBuildingNoChange} />
                <TextField sx={{mb:2}} type="text" label="Zip Code" size="small" value={zipCode} onChange={handleZipCodeChange} />
            </Grid>
            <Grid sx={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 5
            }}>  
                <TextField sx={{mb:2}} type="text" label="Shelter Name" size="small" value={shelterName} onChange={handleShelterNameChange} />
                <TextField sx={{mb:2}} type="email" label="Email" size="small" value={email} onChange={handleEmailChange} />
                <TextField sx={{mb:2}} type="tel" label="Phone Number" size="small" value={phoneNumber} onChange={handlePhoneNumberChange} />
                <TextField sx={{mb:2}} type="password" label="Password" size="small" value={password} onChange={handlePasswordChange} />
                <TextField sx={{mb:2}} type="password" label="Re-enter Password" size="small" value={reEnterPassword} onChange={handleReEnterPasswordChange} />
                <TextField sx={{mb:2}} type="text" label="Description" size="small" value={description} onChange={handleDescriptionChange} />
            </Grid>
            </Stack>
            {/* <Grid>
                <Typography fontSize={'16px'}>Document For Verification</Typography>
                <input name="fileInput" id="fileInput" style={{ display: 'none' }} type="file" onChange={handleFileSelection} />
                <label htmlFor="fileInput">
                <Button sx={{mb:5}} variant="outlined" component="span" fullWidth color="success" startIcon={<InsertDriveFileIcon/>}>
                    {buttonText && buttonText !== '' ? buttonText : 'Choose File'}
                </Button>
                </label>
            </Grid> */}
            <Button variant="outlined" color="success" onClick={handleRegister}>Register</Button>
            <Typography>
                Already have an account? <Link href="/">Login</Link>
            </Typography>
        </Grid>
    );
};

export default RegisterShelter;

import React, { useState } from 'react';
import { TextField, Button, Typography, Link, Grid } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { AuthenticationService } from '../../services/authenticationService';
import toastr from 'toastr';

const RegisterAdmin: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [verificationDocument, setVerificationDocument] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [buttonText, setButtonText] = useState('Choose File');

    const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement> ) => {
        event.preventDefault();
        
        const files = event.target.files;

        if (files && files.length > 0) {
            setButtonText(files[0].name);
          } else {
            setButtonText('Choose File');
          }
    };

    const handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFullName(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleEmployeeIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmployeeId(event.target.value);
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
        AuthenticationService.registerAdministrator(fullName, email, password, phoneNumber, employeeId).then((response) => {
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
            <Typography sx={{mb:2}} fontSize={'30px'}>Administrator Registration</Typography>
            <TextField sx={{mb:2, width: '15vw'}} type="text" label="Full Name" size="small" value={fullName} onChange={handleFullNameChange} />
            <TextField sx={{mb:2, width: '15vw'}} type="email" label="Email" size="small" value={email} onChange={handleEmailChange} />
            <TextField sx={{mb:2, width: '15vw'}} type="text" label="Employee ID" size="small" value={employeeId} onChange={handleEmployeeIdChange} />
            <TextField sx={{mb:2, width: '15vw'}} type="tel" label="Phone Number" size="small" value={phoneNumber} onChange={handlePhoneNumberChange} />
            <TextField sx={{mb:2, width: '15vw'}} type="password" label="Password" size="small" value={password} onChange={handlePasswordChange} />
            <TextField sx={{mb:2, width: '15vw'}} type="password" label="Re-enter Password" size="small" value={reEnterPassword} onChange={handleReEnterPasswordChange} />
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

export default RegisterAdmin;

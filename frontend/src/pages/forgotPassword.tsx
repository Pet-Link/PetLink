import React, { useState } from 'react';
import {
    TextField,
    Button,
    Grid,
    Typography,
    Paper,
    CssBaseline,
} from '@mui/material';
import * as toastr from 'toastr';
import { AuthenticationService } from '../services/authenticationService';
import { UserService } from '../services/userService';
import { Navigate, useNavigate } from 'react-router';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleVerificationCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVerificationCode(event.target.value);
    };

    const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    };

    const sendVerificationCode = () => {
        AuthenticationService.sendVerificationCode(email).then((response) => {
            if (response.ok) {
                toastr.success('Verification code sent.');
                setStep(2);
            } else {
                response.text().then((text) => {
                    toastr.error("Verification code error: " + text);
                }
                );
            }
        }
        );
    };

    const submitVerificationCode = () => {
        AuthenticationService.verifyVerificationCode(email, verificationCode).then((response) => {
            if (response.ok) {
                toastr.success('Verification code accepted.');
                setStep(3);
            } else {
                response.text().then((text) => {
                    toastr.error("Verification code error: " + text);
                    setStep(1);
                }
                );
            }
        }
        );
    };

    const submitNewPassword = () => {
        if (newPassword !== confirmPassword) {
            toastr.error('Passwords do not match.');
            return;
        }
        AuthenticationService.updatePassword(email, newPassword).then((response) => {
            if (response.ok) {
                toastr.success('Password has been reset successfully.');
                setEmail('');
                setVerificationCode('');
                setNewPassword('');
                setConfirmPassword('');
                navigate('/');
            } else {
                response.text().then((text) => {
                    toastr.error("Password update error: " + text);
                    setStep(1);
                }
                );
            }
        }
        );
    };

    const handleReturn = () => {
        navigate('/');
    }

    // Function to handle key press in the password field
    const handleKeyPress1 = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            sendVerificationCode();
        }
    };

    const handleKeyPress2 = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            submitVerificationCode();
        }
    };

    const handleKeyPress3 = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            submitNewPassword();
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
            <Paper sx={{ p: 5, borderRadius: '15px' }}>
                <Typography fontSize={'24px'} mt="16px">
                    Forgot Password
                </Typography>
                <Typography fontSize={'20px'} mt="16px">
                    Reset Your Password
                </Typography>
                <Grid
                    item
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 5,
                        mb: 5,
                    }}
                >
                    {step === 1 && (
                        <>
                            <TextField
                                label="Email"
                                value={email}
                                onChange={handleEmailChange}
                                sx={{ mb: 2 }}
                                size="small"
                                onKeyPress={handleKeyPress1}
                            />
                            <Button variant="contained" color="primary" onClick={sendVerificationCode} sx={{ mb: 6 }}
                            >
                                Send Verification Code
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleReturn} sx={{ mb: 6 }}>
                                Return to Login
                            </Button>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <TextField
                                label="Verification Code"
                                value={verificationCode}
                                onChange={handleVerificationCodeChange}
                                sx={{ mb: 2 }}
                                size="small"
                                onKeyPress={handleKeyPress2}
                            />
                            <Button variant="contained" color="primary" onClick={submitVerificationCode} sx={{ mb: 6 }}>
                                Submit Verification Code
                            </Button>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <TextField
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                sx={{ mb: 2 }}
                                size="small"
                            />
                            <TextField
                                label="Confirm New Password"
                                type="password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                onKeyPress={handleKeyPress3}
                                sx={{ mb: 2 }}
                                size="small"
                            />
                            <Button variant="contained" color="primary" onClick={submitNewPassword} sx={{ mb: 6 }}>
                                Submit New Password
                            </Button>
                        </>
                    )}
                </Grid>
            </Paper>
        </Grid>
    );
}

import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {Typography, Grid, FormControl, RadioGroup, FormControlLabel, Radio} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { adoptionApplicationService } from '../../../services/adoptionApplicationService';
import applyAdoptModel from '../../../models/applyAdoptModel';
import toastr from 'toastr';

const SeeAdoptionApplicationPage = () => {
    const inputStyle = {marginBottom: '20px', alignItems: 'center'};
    
    const location = useLocation();
    const navigate = useNavigate();
    const { adopter_ID, pet_ID } = location.state || {};

    const [application, setApplication] = useState<applyAdoptModel>();
    const [admin_remarks, setAdminRemarks] = useState('');
    

    const fetchApplication = async () => {
        try {
            const response = await adoptionApplicationService.getApplication(adopter_ID, pet_ID);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data: applyAdoptModel = await response.json();
            setApplication(data);
            setAdminRemarks(data.admin_remarks || '');
        } catch (error) {
            console.error("There was an error fetching the application:", error);
        }
    };

    useEffect(() => {
        fetchApplication();
    }, []);

    
    const handleAdminRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAdminRemarks(event.target.value);
    };
    
    const handleEvaluate = (approvalStatus: number) => {
        if (!admin_remarks || admin_remarks.trim().length === 0) {
            toastr.error('Admin remarks are required to evaluate an application.');
            return; 
        }

        adoptionApplicationService.evaluateApplication(adopter_ID, pet_ID, approvalStatus, admin_remarks).then((response) => {
            if (response.ok) {
                response.text().then((text) => {
                    try {
                        toastr.success(text);
                    } catch (error) {
                        console.error('Invalid JSON:', text);
                    }
                });
                navigate('/administrator/view-applications');
            } else {
                response.text().then((text) => {
                    try {
                        toastr.error('Failed to evaluate application.', text);
                    } catch (error) {
                        console.error('Invalid JSON:', text);
                    }
                });
            }
        }
        );
    }

    const handleDelete = () => {
        adoptionApplicationService.deleteApplication(adopter_ID, pet_ID).then((response) => {
            if (response.ok) {
                response.text().then((text) => {
                    try {
                        toastr.success(text);
                    } catch (error) {
                        console.error('Invalid JSON:', text);
                    }
                });
                navigate('/administrator/view-applications');
            } else {
                response.text().then((text) => {
                    try {
                        toastr.error('Failed to delete application', text);
                    } catch (error) {
                        console.error('Invalid JSON:', text);
                    }
                });
            }
        }
        );
    }

    return (
        <Grid container spacing={2} style={{maxWidth: '700px', margin: 'auto', marginTop: '35px', textAlign: 'center'}}>
            <Grid item xs={12}>
                <Typography variant="h4" align="center" gutterBottom>
                    Requested pet: {application?.pet_name || ''} from {application?.shelter_name || ''}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="secondary" onClick={() => navigate('/administrator/edit-pet-details',  { state: { adopter_ID: adopter_ID, pet_ID: pet_ID } })} sx={{
                    marginLeft: 5,
                    width: 200,
                    height: 50,
                    marginBottom: '20px',
                    alignItems: 'center',
                    bgcolor: '#C0C304',
                    }
                }>
                    Go to Dog Detail Page
                </Button>
            </Grid>

            <Grid item xs={12}>
                <Typography variant="h4" align="center" gutterBottom>
                    Application Detail
                </Typography>
            </Grid>

            {/* Name*/}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Name
                </Typography>
                <TextField
                    value={application?.adopter_name || ''}
                    InputProps={{readOnly: true}}
                    label="Name of the Adopter"
                    fullWidth
                    style={inputStyle}
                />
            </Grid>

            {/* Date*/}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Application Date
                </Typography>
                <TextField
                    value={application?.date || ''}
                    InputProps={{readOnly: true}}
                    label="Application Date"
                    fullWidth
                    style={inputStyle}
                />
            </Grid>

            {/* Mail*/}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Mail
                </Typography>
                <TextField
                    value={application?.adopter_e_mail || ''}
                    InputProps={{readOnly: true}}
                    label="Mail of the adopter"
                    fullWidth
                    style={inputStyle}
                />
            </Grid>

            {/* Age */}
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Age
                </Typography>
                <TextField
                    value={application?.adopter_age || ''}
                    InputProps={{readOnly: true}}
                    label="Enter a number"
                    fullWidth
                    type="number"
                    style={inputStyle}
                />
            </Grid>

            {/* Sex */}
            <Grid item xs={12}>

                <Typography variant="h6" gutterBottom>
                    Sex
                </Typography>
                <TextField
                    label="Sex of the applicant"
                    fullWidth
                    value={application?.adopter_sex || ''}
                    InputProps={{readOnly: true}}
                    style={inputStyle}
                />
            </Grid>
            <Grid item xs={12}>
                {/* Other pets information */}
                <Typography variant="h6" gutterBottom>
                    Other pets
                </Typography>

                <TextField
                    label="Does the applicant have other pets?"
                    fullWidth
                    value={application?.pet_ownership || ''}
                    InputProps={{readOnly: true}}
                    style={inputStyle}
                />
            </Grid>
            {/* Other Questions */}
            <Grid item xs={12}>

                <Typography variant="h6" gutterBottom>
                    Years they have been a pet owner
                </Typography>
                <TextField
                    InputProps={{readOnly: true}}
                    label="Enter a number"
                    fullWidth
                    type="number"
                    value={application?.pet_care_experience || ''}
                    style={inputStyle}
                />
                <Typography variant="h6" gutterBottom>
                    Current housing situation
                </Typography>
                <TextField
                    InputProps={{readOnly: true}}
                    multiline
                    rows={4}
                    fullWidth
                    value={application?.housing_situation || ''}
                    style={inputStyle}
                />
                <Typography variant="h6" gutterBottom>
                    Adoption Reason
                </Typography>
                <TextField
                    InputProps={{readOnly: true}}
                    value={application?.adoption_reason || ''}
                    multiline
                    rows={4}
                    fullWidth
                    style={inputStyle}
                />

                <Typography variant="h6" gutterBottom>
                    Administrator’s remarks
                </Typography>
                <TextField
                    label="Please explain why you are accepting or declining this application. "
                    multiline
                    rows={4}
                    value={admin_remarks}
                    onChange={handleAdminRemarksChange}
                    fullWidth
                    style={inputStyle}
                />
            </Grid>

            {/* Submit Application Button */}
            <Grid item xs={12}>
                <Button variant="contained" color="secondary" onClick={() => handleEvaluate(1)} sx={{
                    width: 200,
                    height: 50,
                    marginBottom: '20px',
                    alignItems: 'center',
                    marginTop: 3,
                    bgcolor: '#04C35C', 
                }}>
                    Approve Application
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleEvaluate(0)} sx={{
                    marginLeft: 5,
                    width: 200,
                    height: 50,
                    marginBottom: '20px',
                    alignItems: 'center',
                    marginTop: 3,
                    bgcolor: '#C30404'
                }}>
                    Decline Application
                </Button>
                <Button variant="contained" color="secondary" onClick={handleDelete} sx={{
                    marginLeft: 5,
                    width: 200,
                    height: 50,
                    marginBottom: '20px',
                    alignItems: 'center',
                    marginTop: 3,
                    bgcolor: '#000000'
                }}>
                    Delete Application
                </Button>
            </Grid>
        </Grid>
    );
};

export default SeeAdoptionApplicationPage;

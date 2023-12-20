// AdminRegistrationApprovalPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Button,
} from '@mui/material';
import RegistrationApprovalModel from '../../../models/registrationApprovalModel';

const AdminRegistrationApprovalPage: React.FC = () => {
    const [pendingApprovals, setPendingApprovals] = useState<RegistrationApprovalModel[]>([]);

    useEffect(() => {
        // Mock data for pending registration approvals
        const mockData: RegistrationApprovalModel[] = [
            {
                registration_ID: 1,
                user_ID: 101,
                admin_ID: 201,
                status: 'Pending',
                details: 'Registration for Shelter User 1',
            },
            {
                registration_ID: 2,
                user_ID: 102,
                admin_ID: 201,
                status: 'Pending',
                details: 'Registration for Vet User 2',
            },
            {
                registration_ID: 3,
                user_ID: 103,
                admin_ID: 201,
                status: 'Pending',
                details: 'Registration for Admin User 3',
            },
        ];

        setPendingApprovals(mockData);
    }, []);

    const handleApprove = (registration_ID: number, user_ID: number) => {
        // Add logic to send the approval status to the server or perform any required actions
        console.log('Approving registration:', registration_ID);
        // You can update the UI by removing the approved registration from the pending list
        setPendingApprovals((prevApprovals) =>
            prevApprovals.filter((approval) => approval.registration_ID !== registration_ID)
        );
    };

    const handleReject = (registration_ID: number, user_ID: number) => {
        // Add logic to send the rejection status to the server or perform any required actions
        console.log('Rejecting registration:', registration_ID);
        // You can update the UI by removing the rejected registration from the pending list
        setPendingApprovals((prevApprovals) =>
            prevApprovals.filter((approval) => approval.registration_ID !== registration_ID)
        );
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Registration Approvals
            </Typography>
            <Grid container spacing={2}>
                {pendingApprovals.map((approval, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                        <Card>
                            <CardHeader title={`User ID: ${approval.user_ID}`} />
                            <CardContent>
                                <Typography variant="body1" color="textSecondary" gutterBottom>
                                    Details: {approval.details}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleApprove(approval.registration_ID, approval.user_ID)}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{marginLeft: 2}}
                                    onClick={() => handleReject(approval.registration_ID, approval.user_ID)}
                                >
                                    Reject
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default AdminRegistrationApprovalPage;

import React, { useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Button,
} from '@mui/material';
import overseeRecordModel from '../../../models/overseeRecord';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const AdminOverseeRecordView: React.FC = () => {
    //TODO: get records from service, display verification status
    const [overseeRecords, setOverseeRecords] = useState<overseeRecordModel[]>([
        {
            record_ID: 1,
            administrator_ID: 101,
            adopter_ID: 201,
            date: new Date('2023-08-01'),
            details: 'Registration for Pet Adoption',
            verification_status: null,
        },
        {
            record_ID: 2,
            administrator_ID: 102,
            adopter_ID: 202,
            date: new Date('2023-08-02'),
            details: 'Registration for Pet Adoption',
            verification_status: null,
        },
        // Add more sample oversee records as needed
    ]);

    const [selectedRecord, setSelectedRecord] = useState<overseeRecordModel | null>(null);

    const handleApprove = (record_ID: number) => {
        const updatedOverseeRecords = overseeRecords.map(record => {
            if (record.record_ID === record_ID) {
                return {...record, verification_status: true};
            }
            return record;
        });
        setOverseeRecords(updatedOverseeRecords);
    };

    const handleReject = (record_ID: number) => {
        const updatedOverseeRecords = overseeRecords.map(record => {
            if (record.record_ID === record_ID) {
                return {...record, verification_status: false};
            }
            return record;
        });
        setOverseeRecords(updatedOverseeRecords);
    };

    const handleSeeDetails = (record: overseeRecordModel) => {
        setSelectedRecord(record);
    };

    const handleCloseDetails = () => {
        setSelectedRecord(null);
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Approve Registrations
            </Typography>
            <Grid container spacing={2}>
                {overseeRecords.map((record, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                        <Card>
                            <CardHeader
                                title={`Record ID: ${record.record_ID}`}
                                subheader={`Administrator ID: ${record.administrator_ID}`}
                            />
                            <CardContent>
                                <Typography variant="body1" color="textSecondary" gutterBottom>
                                    Date: {record.date.toDateString()}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Verification
                                    Status: {record.verification_status === null ? 'Pending' : record.verification_status ? 'Approved' : 'Rejected'}
                                </Typography>
                                <>
                                    <Button
                                        variant="contained" color="success"
                                        style={{marginLeft: 8}}
                                        onClick={() => handleSeeDetails(record)}
                                    >
                                        See Details
                                    </Button>
                                </>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={!!selectedRecord} onClose={handleCloseDetails}>
                <DialogTitle>Details</DialogTitle>
                <DialogContent>
                    {selectedRecord && (
                        <div>
                            <Typography variant="body1" gutterBottom>
                                Date: {selectedRecord.date.toDateString()}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Details: {selectedRecord.details}
                            </Typography>
                            {/* Add more details as needed */}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminOverseeRecordView;
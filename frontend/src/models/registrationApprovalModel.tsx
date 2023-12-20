import React from 'react';
type RegistrationApprovalModel = {
    registration_ID: number;
    user_ID: number;
    admin_ID: number;
    status: 'Pending' | 'Approved' | 'Rejected';
    details: string;
};

export default RegistrationApprovalModel;

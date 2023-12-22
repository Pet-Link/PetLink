import React from 'react';
type medicalRecordModel = {
    record_ID?: number;
    pet_ID: number;
    veterinarian_ID: number;
    date: string;
    operation: string;
    pet_name?: string;
    veterinarian_name?: string;
};

export default medicalRecordModel;
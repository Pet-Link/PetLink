import React from 'react';
type appointmentModel = {
    adopter_ID: number;
    veterinarian_ID: number;
    date: string;
    approval_status: boolean | null;
    details: string;
    adopter_name?: string;
    pet_breed?: string;
    pet_species?: string;
    pet_ID?: number;
    veterinarian_name?: string;
    pet_name?: string;
};

export default appointmentModel;
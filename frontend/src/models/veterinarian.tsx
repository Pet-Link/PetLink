import React from 'react';
type veterinarianModel = {
    user_ID: number;
    year_of_experience: number;
    speciality: string;
    street: string;
    district: string;
    apartment_no: string;
    city: string;
    zip: string;
    country: string;
    veterinarian_name?: string; 
};

export default veterinarianModel;
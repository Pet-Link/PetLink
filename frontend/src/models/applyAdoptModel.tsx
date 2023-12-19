import React from 'react';
type applyAdoptModel = {
    adopter_ID: number;
    pet_ID: number;
    administrator_ID: number | null;
    pet_ownership: boolean;
    pet_care_experience: number;
    housing_situation: string;
    adoption_reason: string;
    approval_status: number | null;
    admin_remarks: string | null;
    date: string | null;
    adopter_name: string | null;
    pet_name: string | null; 
    shelter_name: string | null;
    adopter_age: number | null;
    adopter_sex: string | null;
    adopter_e_mail: string | null;
};

export default applyAdoptModel;
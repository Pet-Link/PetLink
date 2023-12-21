import React from 'react';
type petModel = {
    pet_ID?: number;
    shelter_ID: number | null;
    adopter_ID?: number;
    species: string;
    breed: string;
    age: string;
    neutered_status: boolean;
    sex: string;
    description : string;
    name: string;
    vaccination_status: boolean;
    house_trained_status: boolean;
    adoption_status?: boolean;
    adoption_fee: number;
    shelter_name: string | null;
};

export default petModel;
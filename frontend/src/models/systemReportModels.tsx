export type TopVeterinarianModel = {
    user_ID: number;
    name: string;
    speciality: string;
    year_of_experience: number;
    appointment_count: number;
};

export type AdoptionFeesSummaryModel = {
    max_fee_pet_name: string;
    max_fee_shelter_name: string;
    max_fee_adoption_status: number;
    max_fee: number;
    min_fee_pet_name: string;
    min_fee_shelter_name: string;
    min_fee_adoption_status: number;
    min_fee: number;
    total_adoption_fee: number;
};

export type TopAdopterModel = {
    user_ID: number;
    name: string;
    adoption_count: number;
};

export type TopAdoptedBreedModel = {
    breed: string;
    adoption_count: number;
};

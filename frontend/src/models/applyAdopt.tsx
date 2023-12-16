type applyAdoptModel = {
    adopter_ID: number;
    pet_ID: number;
    administrator_ID: number;
    date: Date;
    pet_ownership: boolean;
    pet_care_experience: number;
    housing_situation: string;
    adoption_reason: string;
    approval_status: boolean;
    admin_remarks: string;
};

export default applyAdoptModel;
type petModel = {
    pet_ID: number;
    shelter_ID: number;
    adopter_ID: number;
    species: string;
    breed: string;
    age: number;
    neutered_status: boolean;
    sex: string;
    description : string;
    name: string;
    vaccination_status: boolean;
    house_trained_status: boolean;
    adoption_status: boolean;
    adoption_fee: bigint;
};

export default petModel;
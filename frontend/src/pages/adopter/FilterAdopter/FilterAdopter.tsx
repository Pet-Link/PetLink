// AnimalList.tsx
import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import AnimalCard from './AnimalCard';
import { PetService } from '../../../services/petService';
import petModel from "../../../models/petModel";

interface Animal {
    name: string;
    age: string;
    species: string;
    breed: string;
}

const AnimalList: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [animals, setAnimals] = useState<Animal[]>([]);

    const fetchAnimals = async () => {
        try {
            const res = await PetService.getPets();
            const data: petModel[] = await res.json();

            const animalData: Animal[] = data.map((pet: petModel) => ({
                name: pet.name,
                age: pet.age.toString(), // Assuming 'age' should be a string
                species: pet.species,
                breed: pet.breed,
            }));

            setAnimals(animalData);
        } catch (error) {
            console.error('Error fetching animals:', error);
        }
    };

    useEffect(() => {
        fetchAnimals();
    }, []);

    return (
        <Grid container spacing={2}>
            {animals.map((animal: Animal, index: number) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <AnimalCard animal={animal} />
                </Grid>
            ))}
        </Grid>
    );
};

export default AnimalList;

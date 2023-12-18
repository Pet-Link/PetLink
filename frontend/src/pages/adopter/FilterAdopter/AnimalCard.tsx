// AnimalCard.tsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface Animal {
    name: string;
    age: string;
    species: string;
    breed: string;
}

interface AnimalCardProps {
    animal: Animal;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{animal.name}</Typography>
            <Typography variant="body2">Age: {animal.age}</Typography>
    <Typography variant="body2">Species: {animal.species}</Typography>
    <Typography variant="body2">Breed: {animal.breed}</Typography>
    </CardContent>
    </Card>
);
};

export default AnimalCard;

import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columnsForTopVets: GridColDef[] = [
    { field: 'id', headerName: 'ID Vet', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
    },
    {
      field: 'speciality',
      headerName: 'Speciality',
      width: 120,
    },
    {
      field: 'yearsOfExperience',
      headerName: 'Years Of Experience',
      type: 'number',
      width: 150,
    },
    {
      field: 'countAppointments',
      headerName: 'Count',
      type: 'number',
      width: 150,
    },
  ];
  
const rowsForTopVet = [
    { id: 1, name: 'Snow', speciality: 'Cats', yearsOfExperience: 14, countAppointments: 20 },
    { id: 2, name: 'Veteriner 3', speciality: 'Dogs', yearsOfExperience: 4, countAppointments: 9 },
  ];

const columnsForMostAdoptedPetsAdoptedByUser: GridColDef[] = [
    { field: 'id', headerName: 'ID User', width: 90 },
    { field: 'nameUser', headerName: 'Name', width: 150 },
    { field: 'countAdoption', headerName: 'Adoption Count', width: 150 },
];
const rowsForMostAdoptedPetsAdoptedByUser = [
    { id: 2, nameUser: 'Ahmet', countAdoption: 5 },
    { id: 5, nameUser: 'Mehmet', countAdoption: 3 }
];

const columnsForMostAdoptedPetBreed: GridColDef[] = [
    { field: 'id', headerName: 'Place', width: 90},
    { field: 'breed', headerName: 'Pet Breed', width: 150 },
    { field: 'countAdopted', headerName: 'Adoption Count', width: 150 },
];

const rowsForMostAdoptedPetBreed = [
    { id: 1, breed: 'Golden Retriever', countAdopted: 5 },
    { id: 2, breed: 'Poodle', countAdopted: 3 }
];

const Statistics = () => {
    
    return (
        <Grid sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 5, 
            mb: 5
        }}>
            <Typography variant="h4" gutterBottom>
                System Reports
            </Typography>
            <Typography variant="h6" gutterBottom>
                Top Vets
            </Typography>
            <Box sx={{ height: 400, width: '50%', mb:5 }}>
                <DataGrid
                    rows={rowsForTopVet}
                    columns={columnsForTopVets}
                    initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 5,
                        },
                    },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
            <Typography variant="h6" gutterBottom>
                Most Number of Pets Adopted by a User
            </Typography>        
            <Box sx={{ height: 400, width: '30%', mb:5 }}>
                <DataGrid
                    rows={rowsForMostAdoptedPetsAdoptedByUser}
                    columns={columnsForMostAdoptedPetsAdoptedByUser}
                    initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 5,
                        },
                    },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
            <Typography variant="h6" gutterBottom>
                Most Adopted Pet Breed
            </Typography>
            <Box sx={{ height: 400, width: '30%' }}>
            <DataGrid
                rows={rowsForMostAdoptedPetBreed}
                columns={columnsForMostAdoptedPetBreed}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 5,
                    },
                },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
            </Box>
        </Grid>
    );
};

export default Statistics;

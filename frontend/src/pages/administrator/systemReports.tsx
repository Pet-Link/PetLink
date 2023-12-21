import React, {useState, useEffect} from 'react';
import { Typography, Grid, Box, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { TopVeterinarianModel, AdoptionFeesSummaryModel, TopAdopterModel, TopAdoptedBreedModel }  from '../../models/systemReportModels';
import { SystemReportService } from '../../services/systemReportService';
import toastr from 'toastr';

const columnsForTopVets: GridColDef[] = [
    { field: 'id', headerName: 'ID Vet', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'speciality', headerName: 'Speciality', width: 120 },
    { field: 'year_of_experience', headerName: 'Years Of Experience', type: 'number', width: 150 },
    { field: 'appointment_count', headerName: 'Count', type: 'number', width: 150 },
];
  
const columnsForMostAdoptedPetsAdoptedByUser: GridColDef[] = [
    { field: 'id', headerName: 'ID User', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'adoption_count', headerName: 'Adoption Count', width: 150 },
];

const columnsForMostAdoptedPetBreed: GridColDef[] = [
    { field: 'id', headerName: 'Place', width: 90},
    { field: 'breed', headerName: 'Pet Breed', width: 150 },
    { field: 'adoption_count', headerName: 'Adoption Count', width: 150 },
];


const SystemReports: React.FC = () => {
    const [topVets, setTopVets] = useState<TopVeterinarianModel[]>([]);
    const [adoptionFeesSummary, setAdoptionFeesSummary] = useState<AdoptionFeesSummaryModel>();
    const [topAdopters, setTopAdopters] = useState<TopAdopterModel[]>([]);
    const [topAdoptedBreeds, setTopAdoptedBreeds] = useState<TopAdoptedBreedModel[]>([]);

    const fetchSystemReports = async () => {
        // Top veterinarians
        try {
            const response = await SystemReportService.getTopVeterinarians();
            if (response.status === 404) {
                setTopVets([]);
                response.text().then((text) => {
                    toastr.info(text);
                });
            } else if (!response.ok) {
                throw new Error('Network response was not ok.');
            } else {
                const data: TopVeterinarianModel[] = await response.json();
                setTopVets(data);
            }
        } catch (error) {
            toastr.error('Internal error fetching system reports.');
            console.error('Error:', error);
        }
    
        // Top Adopters
        try {
            const response = await SystemReportService.getTopAdopters();
            if (response.status === 404) {
                setTopAdopters([]);
                response.text().then((text) => {
                    toastr.info(text);
                });
            } else if (!response.ok) {
                throw new Error('Network response was not ok.');
            } else {
                const data: TopAdopterModel[] = await response.json();
                setTopAdopters(data);
            }
        } catch (error) {
            toastr.error('Error fetching top adopters');
            console.error('Error:', error);
        }
    
        // Top Adopted Breeds
        try {
            const response = await SystemReportService.getTopAdoptedBreeds();
            if (response.status === 404) {
                setTopAdoptedBreeds([]);
                response.text().then((text) => {
                    toastr.info(text);
                });
            } else if (!response.ok) {
                throw new Error('Network response was not ok.');
            } else {
                const data: TopAdoptedBreedModel[] = await response.json();
                setTopAdoptedBreeds(data);
            }
        } catch (error) {
            toastr.error('Error fetching top adopted breeds');
            console.error('Error:', error);
        }
    
        // Adoption fees summary
        try {
            const response = await SystemReportService.getAdoptionFeesSummary();
            if (response.status === 404) {
                response.text().then((text) => {
                    toastr.info(text);
                });
            } else if (!response.ok) {
                throw new Error('Network response was not ok.');
            } else {
                const data: AdoptionFeesSummaryModel = await response.json();
                setAdoptionFeesSummary(data);
            }
        } catch (error) {
            toastr.error('Error fetching adoption fees summary');
            console.error('Error:', error);
        }
    };
    
    useEffect(() => {
        fetchSystemReports();
    }, []);
    
    console.log(adoptionFeesSummary)
    
    return (
  
        <Grid sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 5, 
            mb: 5
        }}>
            <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>
                    System Reports
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" align="center" gutterBottom>
                    Top Vets
                </Typography>
                <Box sx={{ height: 400, width: '100%', mb:5  }}>
                    <DataGrid
                        rows={topVets.map(vet => ({ ...vet, id: vet.user_ID }))}
                        columns={columnsForTopVets}
                        pageSizeOptions={[5]}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Box>
            </Grid>
            <Typography variant="h6" gutterBottom>
                Most Number of Pets Adopted by a User
            </Typography>        
            <Box sx={{ height: 400, width: '30%', mb:5 }}>
                <DataGrid
                    rows={topAdopters.map(adopter => ({ ...adopter, id: adopter.user_ID }))}
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
            <Box sx={{ height: 400, width: '30%', mb:5 }}>
            <DataGrid
                rows={topAdoptedBreeds.map((breed, index) => ({ ...breed, id: index }))}
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
            <Grid item xs={12}>
                <Typography variant="h6" align="center" gutterBottom>
                    Adoption Fees Summary
                </Typography>
                <Paper variant="outlined" sx={{ padding: 2, mb: 2 }}>
                    <Typography variant="subtitle1">
                        Total fees collected for the adopted pets: ${adoptionFeesSummary ? adoptionFeesSummary.total_adoption_fee : "0"}
                    </Typography>
                </Paper>
                <Paper variant="outlined" sx={{ padding: 2, mb: 2 }}>
                    <Typography>
                        Pet with the highest fee: 
                        <Box component="span">
                            {adoptionFeesSummary ? adoptionFeesSummary.max_fee_pet_name : ""},{' '}
                            {adoptionFeesSummary ? adoptionFeesSummary.max_fee_shelter_name : ""},{' '}
                            ${adoptionFeesSummary ? adoptionFeesSummary.max_fee : ""},{' '}
                            {adoptionFeesSummary ? adoptionFeesSummary.max_fee_adoption_status ? "Adopted" : "Unadopted" : ""}
                        </Box>
                    </Typography>
                </Paper>
                <Paper variant="outlined" sx={{ padding: 2 }}>
                    <Typography>
                        Pet with the lowest fee: 
                        <Box component="span">
                            {adoptionFeesSummary ? adoptionFeesSummary.min_fee_pet_name : ""},{' '}
                            {adoptionFeesSummary ? adoptionFeesSummary.min_fee_shelter_name : ""},  {' '}
                            ${adoptionFeesSummary ? adoptionFeesSummary.min_fee : ""},  {' '}
                            {adoptionFeesSummary ? adoptionFeesSummary.min_fee_adoption_status ? "Adopted" : "Unadopted" : ""} 
                        </Box>
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default SystemReports;

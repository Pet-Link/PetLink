import React from 'react';
//Administrator imports
import HomeAdmin from './pages/administrator/HomeAdministrator/HomeAdministrator';
import SeeApplicationDetails from './pages/administrator/SeeApplicationDetailsAdministrator/SeeApplicationDetailsAdministrator';
import RegisterAdmin from './pages/administrator/registerAdmin';
import viewApplications from './pages/administrator/viewApplications';
import AdminAddOverseeRecord from './pages/administrator/AdminAddOverseeRecord/AdminAddOverseeRecord';
import AdminOverseeRecordView from './pages/administrator/AdminOverseeRecordView/AdminOverseeRecordView';

//Adopter imports
import HomeAdopter from './pages/adopter/HomeAdopter/HomeAdopter';
import AnimalDetails from './pages/adopter/AnimalDetails/DetailOfPetToAdoptAdopter';
import ApplicationFormAdopter from './pages/adopter/ApplicationFormAdopter/ApplicationFormAdopter';
import FilterAdopter from './pages/adopter/FilterAdopter/FilterAdopter';
import balance from './pages/adopter/balance';
//import Filter from './pages/adopter/filter';
import RegisterAdopter from './pages/adopter/registerAdopter';

//Forum imports
import Forum from './pages/forum/Forum';

//Shelter imports
import HomeShelter from './pages/shelter/HomeShelter/HomeShelter';
import EnterAnimal from './pages/shelter/enterAnimal';
import RegisterShelter from './pages/shelter/registerShelter';
import ShelterViewMeetAndGreet from './pages/shelter/ShelterViewMeetAndGreet/ShelterViewMeetAndGreet';

//Vet imports
import HomeVet from './pages/vet/HomeVet/HomeVet';
import CreateMedicalRecord from './pages/vet/CreateMedicalRecord/CreateMedicalRecord';
import ManageAppointmentsVet from './pages/vet/ManageAppointmentsVet/ManageAppointmentsVet';
import RegisterVet from './pages/vet/registerVet';


import Login from './pages/login';
import Router from './router/router';
import 'toastr/build/toastr.min.css';

// ... import other pages as needed

function App() {
  return (
    <Router/>
  );
}

export default App;

import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Login from '../pages/login';
import RegisterAdmin from '../pages/administrator/registerAdmin';
import RegisterAdopter from '../pages/adopter/registerAdopter';
import RegisterVet from '../pages/vet/registerVet';
import RegisterShelter from '../pages/shelter/registerShelter';
import ResponsiveAppBar from '../pages/components/NavbarAdministrator';
import ResponsiveAppBarAdopter from '../pages/components/NavbarAdopter';
import ResponsiveAppBarVet from '../pages/components/NavbarVet';
import ResponsiveAppBarShelter from '../pages/components/NavbarShelter';
import HomeAdopter from '../pages/adopter/HomeAdopter/HomeAdopter';
import HomeAdministrator from '../pages/administrator/HomeAdministrator/HomeAdministrator';
import HomeShelter from '../pages/shelter/HomeShelter/HomeShelter';
import HomeVet from '../pages/vet/HomeVet/HomeVet';
import SeeAdoptionApplicationPage from '../pages/administrator/SeeApplicationDetailsAdministrator/SeeApplicationDetailsAdministrator';
import AdoptionApplicationPage from '../pages/adopter/ApplicationFormAdopter/ApplicationFormAdopter';
import { PermissionContainer } from '../auth/PermissionContainer';
import EnterAnimalDetailsPage from '../pages/shelter/enterAnimal';
import Balance from '../pages/adopter/balance';
import ViewApplications from '../pages/administrator/viewApplications';
import ManageAppointmentsVet from '../pages/vet/ManageAppointmentsVet/ManageAppointmentsVet';
import LogMedicalRecord from '../pages/vet/CreateMedicalRecord/CreateMedicalRecord';
import CreatePet from '../pages/adopter/createPet';
import PetDetailsPage from '../pages/adopter/AnimalDetails/DetailOfPetToAdoptAdopter';
import EditPetDetailsPage from '../pages/administrator/editPetDetails';
import ViewMeetAndGreets from '../pages/adopter/ViewMeetAndGreets';
import SearchVets from '../pages/adopter/SearchVets';
import Statistics from '../pages/administrator/Statistics';
import Forum from '../pages/forum/Forum';
import PetCareInfo from '../pages/petcare/PetCareInfo';
import VetAppointments from '../pages/adopter/VetApointments';

const Router: React.FC = () => {
    return <RouterProvider router={router}/>;
}

const router = createBrowserRouter([
    { path: '', element: <Login /> },
    { path: '/register-administrator', element: <RegisterAdmin /> },
    { path: '/register-adopter', element: <RegisterAdopter /> },
    { path: '/register-veterinarian', element: <RegisterVet /> },
    { path: '/register-shelter', element: <RegisterShelter /> },
    { path: '/administrator',
      element: (
        <PermissionContainer roles='Administrator'>
          <ResponsiveAppBar />
          <Outlet />
        </PermissionContainer>
      ),
      children: [
        { path: 'home', 
          element: ( 
          <PermissionContainer roles='Administrator'>
            <HomeAdministrator />
            <Outlet />
          </PermissionContainer> ),
        },
        { path: 'view-applications', element: <ViewApplications />},
        { path: 'see-application-detail', element: <SeeAdoptionApplicationPage /> },
        { path: 'edit-pet-details', element: <EditPetDetailsPage /> },
        { path: 'statistics', element: <Statistics />}
        // add routes here
      ],
    },
    { path: '/adopter', 
      element: (
        <PermissionContainer roles='Adopter'>
          <ResponsiveAppBarAdopter />
          <Outlet />
        </PermissionContainer>
      ),
      children: [
        { path: 'home', 
          element: ( 
          <PermissionContainer roles='Adopter'>
            <HomeAdopter />
            <Outlet />
          </PermissionContainer> ),
        },
        { path: 'adoption-application', element: <AdoptionApplicationPage /> },
        { path: 'payment', element: <Balance />},
        { path: 'create-pet', element: <CreatePet />},
        { path: 'pet-details', element: <PetDetailsPage />},
        { path: 'view-meet-and-greets', element: <ViewMeetAndGreets />},
        { path: 'search-vets', element: <SearchVets />},
        { path: 'pet-care-info', element: <PetCareInfo />},
        { path: 'vet-appointments', element: <VetAppointments />},
        // add routes here
      ]
    },
    { path: '/shelter',
      element: ( 
        <PermissionContainer roles='Shelter'>
          <ResponsiveAppBarShelter />
          <Outlet />
        </PermissionContainer> ),
      children: [
        { path: 'home', 
          element: ( 
            <PermissionContainer roles='Shelter'>
              <HomeShelter />
              <Outlet />
            </PermissionContainer> ), 
        },
        {
          path: 'enter-animal',
          element: <EnterAnimalDetailsPage />,
        }
      ]
    },
    { path: '/veterinarian',
      element: (
        <PermissionContainer roles='Veterinarian'>
          <ResponsiveAppBarVet />
          <Outlet />
          </PermissionContainer>
          ),
        children: [
          { path: 'home',
            element: (
              <PermissionContainer roles='Veterinarian'>
                <HomeVet />
                <Outlet />
              </PermissionContainer>
            ),
          },
          {
            path: 'see-appointments',
            element: <ManageAppointmentsVet />,
          },
          {
            path: 'log-medical-details',
            element: <LogMedicalRecord />,
          }
        ]
    },
    { path: '/forum-adopter',
      element: (
        <PermissionContainer roles=''>
          <ResponsiveAppBarAdopter />
          <Forum/>
          <Outlet />
          </PermissionContainer>
          ),
    },
    { path: '/forum-vet',
      element: (
        <PermissionContainer roles=''>
          <ResponsiveAppBarVet />
          <Forum/>
          <Outlet />
          </PermissionContainer>
          ),
    },
    { path: '/forum-shelter',
      element: (
        <PermissionContainer roles=''>
          <ResponsiveAppBarShelter />
          <Forum/>
          <Outlet />
          </PermissionContainer>
          ),
    },
    { path: '/forum-administrator',
      element: (
        <PermissionContainer roles=''>
          <ResponsiveAppBar/>
          <Forum/>
          <Outlet />
          </PermissionContainer>
          ),
    },
]);

export default Router;






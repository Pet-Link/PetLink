import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Login from '../pages/login';
import RegisterAdmin from '../pages/administrator/registerAdmin';
import RegisterAdopter from '../pages/adopter/registerAdopter';
import RegisterVet from '../pages/vet/registerVet';
import RegisterShelter from '../pages/shelter/registerShelter';
import ResponsiveAppBar from '../pages/components/NavbarAdministrator';
import ResponsiveAppBarAdopter from '../pages/components/NavbarAdopter';
import HomeAdopter from '../pages/adopter/HomeAdopter/HomeAdopter';
import HomeAdministrator from '../pages/administrator/HomeAdministrator/HomeAdministrator';
import HomeShelter from '../pages/shelter/HomeShelter/HomeShelter';
import SeeAdoptionApplicationPage from '../pages/administrator/SeeApplicationDetailsAdministrator/SeeApplicationDetailsAdministrator';
import AdoptionApplicationPage from '../pages/adopter/ApplicationFormAdopter/ApplicationFormAdopter';
import { AuthContainer } from '../auth/AuthContainer';

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
        <AuthContainer>
          <ResponsiveAppBar />
          <Outlet />
        </AuthContainer>
      ),
      children: [
        { path: 'home', 
          element: ( 
          <AuthContainer>
            <HomeAdministrator />
            <Outlet />
          </AuthContainer> ),
        },
        { path: 'see-application', element: <SeeAdoptionApplicationPage /> },
        // add routes here
      ],
    },
    { path: '/adopter', 
      element: (
        <AuthContainer>
          <ResponsiveAppBarAdopter />
          <Outlet />
        </AuthContainer>
      ),
      children: [
        { path: 'home', 
          element: ( 
          <AuthContainer>
            <HomeAdopter />
            <Outlet />
          </AuthContainer> ),
        },
        { path: 'see-application', element: <AdoptionApplicationPage /> },
        // add routes here
      ]
    },
    { path: '/shelter',
      element: ( 
        <AuthContainer>
          <Outlet />
        </AuthContainer> ),
      children: [
        { path: 'home', 
          element: ( 
            <AuthContainer>
              <ResponsiveAppBar />
              <HomeShelter />
              <Outlet />
            </AuthContainer> ), 
        }
      ]
    },
    { path: '/veterinarian',}
]);

export default Router;






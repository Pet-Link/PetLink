import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/login';
import RegisterAdmin from '../pages/administrator/registerAdmin';
import RegisterAdopter from '../pages/adopter/registerAdopter';
import RegisterVet from '../pages/vet/registerVet';
import RegisterShelter from '../pages/shelter/registerShelter';

const Router: React.FC = () => {
    return <RouterProvider router={router}/>;
}

const router = createBrowserRouter([
    { path: '', element: <Login /> },
    { path: '/register-administrator', element: <RegisterAdmin /> },
    { path: '/register-adopter', element: <RegisterAdopter /> },
    { path: '/register-veterinarian', element: <RegisterVet /> },
    { path: '/register-shelter', element: <RegisterShelter /> },
]);

export default Router;






import React from 'react';
import Login from './pages/login';
import RegisterAdmin from './pages/administrator/registerAdmin';
import RegisterAdopter from './pages/adopter/registerAdopter';
import RegisterVet from './pages/vet/registerVet';
import Router from './router/router';
import 'toastr/build/toastr.min.css';
import Application from './pages/adopter/ApplicationFormAdopter/ApplicationFormAdopter';

// ... import other pages as needed

function App() {
  return (
    <Router/>
  );
}

export default App;

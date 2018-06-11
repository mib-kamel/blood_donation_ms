import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app';
import Home from './components/home';
import UpdateDonor from './components/donors/updateDonor';
import PatientsHome from './components/patients/patientsHome';

//The routes
export default (
    //The App component which contain the application
    <Route path="/" component={App} >
        //By default render the Home component in the home page
        <IndexRoute component={Home} />
        <Route path="donors/:id" component={UpdateDonor} />
        <Route path="patients" component={PatientsHome} />
    </Route>
);
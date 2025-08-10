
// File not in use

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from './PrivateRoute';

const ProtectedRoutes = () => {
    return(

        <Routes>
            <Route path="/dashboard" element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            } />
        </Routes>
    )
}

export default ProtectedRoutes;

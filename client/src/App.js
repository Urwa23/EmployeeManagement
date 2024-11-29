import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './routes/layout/Layout';
import Dashboard from './routes/dashboard/Dashboard';
import AddVacationPage from './routes/vacations/addVacationRequests/AddVacationPage';
import ViewVacationRequestsPage from './routes/vacations/viewVacationRequests/ViewVacationRequestsPage';
import AddWorkingTimePage from './routes/timetracking/addWorkingTime/AddWorkingTimePage';
import ViewWorkingTimePage from './routes/timetracking/viewWorkingTime/ViewWorkingTimePage';
import ViewAbsencesPage from './routes/absences/viewAbsences/ViewAbsencesPage';
import AddAbsensesPage from './routes/absences/addAbsences/AddAbsencesPage';
import LoginPage from './routes/login/LoginPage';
import { AuthContext } from './context/AuthContext'; 
import { useContext } from "react";
import ViewRequestsPage from './routes/viewRequests/ViewRequestsPage';

// Private Route Component
const PrivateRoute = ({ element }) => {
  const { updateUser, currentUser } = useContext(AuthContext);
  return currentUser ? element : <Navigate to="/login" />;
};

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <PrivateRoute element={<Layout />} />,  // Protect the entire Layout route
      children: [
        {
          index: true,
          element: <PrivateRoute element={<Dashboard />} />,
        },
        {
          path: 'addVacations',
          element: <PrivateRoute element={<AddVacationPage />} />,
        },
        {
          path: 'viewVacations',
          element: <PrivateRoute element={<ViewVacationRequestsPage />} />,
        },
        {
          path: 'addAbsence',
          element: <PrivateRoute element={<AddAbsensesPage />} />,
        },
        {
          path: 'viewAbsenses',
          element: <PrivateRoute element={<ViewAbsencesPage />} />,
        },
        {
          path: 'addWorkingTime',
          element: <PrivateRoute element={<AddWorkingTimePage />} />,
        },
        {
          path: 'viewWorkingTime',
          element: <PrivateRoute element={<ViewWorkingTimePage />} />,
        },
        {
          path: 'viewRequests',
          element: <PrivateRoute element={<ViewRequestsPage />} />,
        },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

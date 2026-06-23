import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import Documents from '../pages/Documents';
import Search from '../pages/Search';
import Settings from '../pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'documents',
        element: <Documents />,
      },
      {
        path: 'search',
        element: <Search />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

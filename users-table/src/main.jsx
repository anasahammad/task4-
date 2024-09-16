import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import AuthProvider from './Provider/AuthProvider.jsx';

import UsersTable from './UsersTable.jsx';
import PrivateRoute from './PrivateRoute.jsx';

const router = createBrowserRouter([ 
  {
    index: true,
    element: <Login/>
  },
  {
    path: '/signup',
    element: <Signup/>

  },
  {
    path: "/table",
    element: <PrivateRoute><UsersTable/></PrivateRoute>
  }
 
 ]); 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>

    <RouterProvider router={router}/>
    </AuthProvider>
  
  </StrictMode>,
)

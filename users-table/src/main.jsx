import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import AuthProvider from './Provider/AuthProvider.jsx';

const router = createBrowserRouter([ 
  { 
  path: "/", 
  element: <App/>, 
  },
  {
    path: '/signup',
    element: <Signup/>

  },
  {
    path: '/login',
    element: <Login/>
  }
 ]); 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>

    <RouterProvider router={router}/>
    </AuthProvider>
  
  </StrictMode>,
)

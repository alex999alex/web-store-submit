import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App'; // Adjust the path as necessary
import Home from './routes/Home';
import Signup from './routes/Signup';
import Login from './routes/Login';
import Logout from './routes/Logout';
// import Address from './routes/Address';
import Details from './routes/Details'; // Import the Details page
import Cart from './routes/Cart';
import Checkout from './routes/Checkout';
import Confirmation from './routes/Confirmation';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },

      {
        path: "/details/:id", // Add the Details route here
        element: <Details />
      },


      {
        path: "/signup",
        element: <Signup />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/logout",
        element: <Logout />
      },

      {
        path: "/Cart",
        element: <Cart />
      },

      {
        path: "/Checkout",
        element: <Checkout />
      },

      {
        path: "/Confirmation",
        element: <Confirmation />
      },


      // {
      //   path: "/address",
      //   element: <Address />
      // },
    ]
  },
]);

  
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

import React from "react"
import Navbar from "./components/navbar/Navbar.jsx"
import Home from "./pages/home/Home";
import Footer from "./components/footer/Footer";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Body from "./components/body/Body.jsx";

import "./app.scss"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import CountryChoice from "./pages/countrychoice/CountryChoice.jsx";


function App() {
  const queryClient = new QueryClient()

  const Layout = () => {
    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Outlet />
          <Footer />
        </QueryClientProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Body/>,
        },
        {
          path: "/start",
          element: <CountryChoice />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
      ],
      
    },
    {
      path: "/home/:id/:countryCode",
      element: <Home />,
    },
    
    
  ]);

  return (
    <div>
      <RouterProvider router={router}/>
      
    </div>
  )
}

export default App
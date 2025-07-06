import React from 'react';
import NadhiLoader from './Loader/Nadhi.dev';
import {
  Outlet,
  RouterProvider,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'


const AuthLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // AuthLayout is a simple layout that doesn’t render the sidebar.
  return (
    <>
     <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
     
    
    </>
  );
};

export default AuthLayout;
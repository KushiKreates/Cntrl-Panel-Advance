import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import './index.css'; // Ensure you have a CSS file for global styles
import 'nprogress/nprogress.css'; // Import NProgress CSS

import { Toaster } from 'sonner';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
<React.StrictMode>
    { !window.location.pathname.startsWith('/home/checkout') && <Toaster /> }
    <RouterProvider router={router} />
</React.StrictMode>
);
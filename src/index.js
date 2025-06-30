// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
// index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // Tailwind last, to override Bootstrap where needed
import { ApplicationInsights } from '@microsoft/applicationinsights-web';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: 'd18bf256-d28c-498a-8959-08dc87120046',
    enableAutoRouteTracking: true
  }
});
appInsights.loadAppInsights();
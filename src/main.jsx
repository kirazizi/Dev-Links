import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';
import App from './App';
import './index.css';

const domain = "dev-5ttprue73ymboj1x.us.auth0.com"
const clientId = "qXBciHZ1TnUo12ywrNUt6aIRDnYNV6sV"
  
createRoot(document.getElementById('root')).render(
      <App />
);

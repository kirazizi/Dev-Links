import { useState } from 'react'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { BrowserRouter, Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import client from './ApolloClient'
import { ApolloProvider } from '@apollo/client'

import LoginPage from './component/LoginPage'
import SignupPage from './component/SignupPage'
import Dashboard from './component/Dashboard'
import PrivateRoute from './component/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

function App() {

  return (
    <AuthProvider>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
    </AuthProvider>
  )
}

export default App

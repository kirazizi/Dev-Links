import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Logo from '../assets/images/logo-devlinks-large.svg';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock } from "lucide-react"
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const {user, login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://${import.meta.env.VITE_AUTH0_DOMAIN}/oauth/token`,
        {
            username: email,
            password: password,
            grant_type: 'password',
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
            client_secret: import.meta.env.VITE_AUTH0_CLIENT_SECRET
        },
        {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      );

      onLoginSuccess(response.data);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const onLoginSuccess = (data) => {
    login(data.access_token);
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="mb-16">
        <img
          src= {Logo}
          alt="Devlinks Logo"
          width={146}
          height={40}
          className="w-36"
        />
      </div>

      <div className="w-full max-w-[476px] space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[#333333]">Login</h1>
          <p className="text-[#737373]">Add your details below to get back into the app</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-[#333333]">
              Email address
            </label>
            <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373] h-5 w-5" />
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex@email.com" 
                className="h-12 pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm text-[#333333]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373] h-5 w-5" />
              <Input 
                id="password" 
                type="password" 
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                className="h-12 pl-10" />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 bg-[#633CFF] hover:bg-[#BEADFF] text-white font-medium">
            Login
          </Button>
        </form>

        <p className="text-center text-[#737373]">
          Don't have an account?{" "}
          <a href="/signup" className="text-[#633CFF] hover:underline">
            Create account
          </a>
        </p>
      </div>
    </div>
  )
};

export default LoginPage;

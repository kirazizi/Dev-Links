import React, { useState } from 'react';
import axios from 'axios';
import Logo from '../assets/images/logo-devlinks-large.svg';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock } from "lucide-react"
import { useNavigate } from 'react-router-dom';


const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `https://${import.meta.env.VITE_AUTH0_DOMAIN}/dbconnections/signup`,
        {
          client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
          email: email,
          password: password,
          connection: 'Username-Password-Authentication',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="mb-16">
        <img
          src={Logo}
          alt="Devlinks Logo"
          width={146}
          height={40}
          className="w-36"
        />
      </div>

      <div className="w-full max-w-[476px] space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[#333333]">Create account</h1>
          <p className="text-[#737373]">Let’s get you started sharing your links!</p>
        </div>

        <form className="space-y-6" onSubmit={handleSignup}>
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

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
                className="h-12 pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm text-[#333333]">
              Create password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373] h-5 w-5" />
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters" 
                className="h-12 pl-10"
                minLength="8"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm text-[#333333]">
              Confirm password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373] h-5 w-5" />
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="At least 8 characters" 
                className="h-12 pl-10"
                minLength="8"
                required
              />
            </div>
            <p className="text-sm text-[#737373]">Password must contain at least 8 characters</p>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-[#633CFF] hover:bg-[#BEADFF] text-white font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create new account'}
          </Button>
        </form>

        <p className="text-center text-[#737373]">
          Already have an account? {""}
          <a href="/login" className="text-[#633CFF] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
};

export default SignupPage;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        username,
        email,
        password,
      });
      
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-spotify-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-black text-white tracking-tighter mb-8">
          TaskFlow
        </h1>
        
        <div className="bg-spotify-black sm:bg-spotify-base py-12 px-8 sm:rounded-xl sm:px-12 shadow-2xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-white tracking-tight">
            Sign up to start organizing
          </h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-md text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">
                What should we call you?
              </label>
              <input
                type="text"
                required
                placeholder="Enter a profile name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-3 bg-spotify-black border border-spotify-highlight rounded-md text-white placeholder-spotify-text focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all sm:text-base hover:border-spotify-text"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">
                What's your email?
              </label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-spotify-black border border-spotify-highlight rounded-md text-white placeholder-spotify-text focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all sm:text-base hover:border-spotify-text"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">
                Create a password
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-spotify-black border border-spotify-highlight rounded-md text-white placeholder-spotify-text focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all sm:text-base hover:border-spotify-text"
              />
              <p className="pt-1 text-xs font-medium text-spotify-text">Must be at least 6 characters.</p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-base font-bold text-black bg-spotify-green hover:bg-spotify-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-spotify-black focus:ring-spotify-green disabled:opacity-50 transition-all transform active:scale-[0.98]"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-spotify-highlight text-center">
            <p className="text-spotify-text text-base">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-white hover:text-spotify-green transition-colors underline hover:no-underline underline-offset-2">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { MessageSquare } from 'lucide-react';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    // Client-side validation
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await register(email, username, password);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      // Extract error message and map to appropriate field
      let errorMessage = 'Registration failed';
      const newErrors = {};
      
      // Check for network errors
      if (error.code === 'ERR_NETWORK' || !error.response) {
        newErrors.general = 'Network Error: Unable to connect to the server. Please make sure the backend is running on http://127.0.0.1:8000';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
        
        // Map common error patterns to fields
        if (errorMessage.toLowerCase().includes('email')) {
          newErrors.email = errorMessage;
        } else if (errorMessage.toLowerCase().includes('username')) {
          newErrors.username = errorMessage;
        } else if (errorMessage.toLowerCase().includes('password')) {
          newErrors.password = errorMessage;
        } else {
          newErrors.general = errorMessage;
        }
      } else if (error.response?.data?.message) {
        newErrors.general = error.response.data.message;
      } else if (error.message) {
        newErrors.general = error.message;
      }
      
      setErrors(newErrors);
      console.error('Registration error:', error);
      
      if (newErrors.general) {
        toast.error(newErrors.general);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className={`max-w-sm md:max-w-md w-full rounded-lg shadow-xl p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MessageSquare className={`w-12 h-12 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Task2SMS</h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="rounded-md bg-red-900 bg-opacity-20 p-4 border border-red-700">
              <p className="text-sm font-medium text-red-400">{errors.general}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.email ? 'border-red-500 bg-red-900 bg-opacity-20 text-red-100' : isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="username" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.username ? 'border-red-500 bg-red-900 bg-opacity-20 text-red-100' : isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-400">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.password ? 'border-red-500 bg-red-900 bg-opacity-20 text-red-100' : isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.confirmPassword ? 'border-red-500 bg-red-900 bg-opacity-20 text-red-100' : isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className={`mt-6 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <Link to="/login" className={`font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;


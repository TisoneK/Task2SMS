import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { MessageSquare } from 'lucide-react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className={`max-w-md w-full rounded-lg shadow-xl p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MessageSquare className={`w-12 h-12 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Task2SMS</h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Turn your tasks into timely SMS updates</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
            />
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
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className={`mt-6 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Don't have an account?{' '}
          <Link to="/register" className={`font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;


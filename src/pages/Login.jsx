import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/Auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.userId);
      localStorage.setItem('name', res.data.user.name);
      localStorage.setItem('email', res.data.user.email);
      localStorage.setItem('role', res.data.user.role);

      window.location.href = '/dashboard';
    } catch {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-900 dark:to-slate-800 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-slate-900 shadow-2xl rounded-3xl overflow-hidden border border-emerald-100 dark:border-slate-700"
      >
        {/* Left Side */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-100 to-teal-200 dark:from-emerald-900 dark:to-teal-800 p-8">
          <h2 className="text-3xl font-bold text-emerald-800 dark:text-white">Welcome to EduSync</h2>
          <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-200">Empowering Minds. Anywhere.</p>
          <img
            src="/login-illustration.png"
            alt="Login Illustration"
            className="mt-6 w-64 drop-shadow-xl"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="px-8 py-10 sm:p-12">
          <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 mb-8">
            Login
          </h3>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl border border-emerald-200 dark:border-slate-600 bg-emerald-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl border border-emerald-200 dark:border-slate-600 bg-emerald-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold transition duration-200 shadow-md"
            >
              🔐 Sign In
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="text-emerald-600 hover:underline dark:text-emerald-400 font-semibold"
            >
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

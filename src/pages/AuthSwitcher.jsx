import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const AuthSwitcher = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    Name: '',
    Email: '',
    Password: '',
    Role: 'Student',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isValidEmail(form.Email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.post('/Auth/login', {
          Email: form.Email,
          Password: form.Password,
        });

        const { token, user } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.userId);
        localStorage.setItem('name', user.name);
        localStorage.setItem('email', user.email);
        localStorage.setItem('role', user.role);

        window.location.href = '/dashboard';
      } else {
        await api.post('/Auth/register', form);
        setSuccess('Registered! Please login.');
        setIsLogin(true);
        setForm({
          Name: '',
          Email: '',
          Password: '',
          Role: 'Student',
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] dark:bg-slate-800 flex items-center justify-center px-4">
      <div className="relative w-full max-w-5xl h-[600px] bg-white dark:bg-slate-700 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-all duration-500">
        {/* Slide Panel */}
        <motion.div
          className="hidden md:flex items-center justify-center p-10 text-center"
          initial={{ x: isLogin ? 0 : -400 }}
          animate={{ x: isLogin ? 0 : -400 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
              {isLogin ? 'Welcome Back!' : 'Join EduSync'}
            </h2>
            <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-200">
              Learn. Grow. Succeed.
            </p>
            <img
              src="https://undraw.co/api/illustrations/597b1e9f-fb55-4077-8827-e963588c06b5"
              alt="Education"
              className="mt-4 w-64 mx-auto"
            />
          </div>
        </motion.div>

        {/* Form Panel */}
        <motion.div
          key={isLogin ? 'login' : 'register'}
          initial={{ x: isLogin ? 300 : -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: isLogin ? -300 : 300, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="p-10 z-10"
        >
          <h2 className="text-3xl font-bold text-emerald-800 dark:text-white mb-4">
            {isLogin ? 'Login to EduSync' : 'Create an Account'}
          </h2>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-200">
                  Full Name
                </label>
                <input
                  type="text"
                  name="Name"
                  value={form.Name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded border bg-emerald-50 dark:bg-slate-600 border-emerald-200 dark:border-slate-500"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-200">
                Email
              </label>
              <input
                type="email"
                name="Email"
                value={form.Email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border bg-emerald-50 dark:bg-slate-600 border-emerald-200 dark:border-slate-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-200">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="Password"
                  value={form.Password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded border bg-emerald-50 dark:bg-slate-600 border-emerald-200 dark:border-slate-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-emerald-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-200">Role</label>
                <select
                  name="Role"
                  value={form.Role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded border bg-emerald-50 dark:bg-slate-600 border-emerald-200 dark:border-slate-500"
                >
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                </select>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : null}
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <p className="text-sm mt-4 text-center text-slate-600 dark:text-slate-300">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-emerald-600 hover:underline"
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthSwitcher;

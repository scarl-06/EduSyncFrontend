import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const Register = () => {
  const [form, setForm] = useState({
    Name: '',
    Email: '',
    Password: '',
    Role: 'Student'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/Auth/register', form);
      setSuccess('🎉 Registration successful! Please login.');
      setError('');
    } catch (err) {
      setError('❗ Registration failed. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-100 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white dark:bg-slate-800 shadow-xl rounded-2xl overflow-hidden p-8 sm:p-10"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 text-center">
          Create an Account
        </h2>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        {success && <p className="text-green-600 mb-3 text-sm">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              value={form.Name}
              onChange={(e) => setForm({ ...form, Name: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg bg-emerald-50 dark:bg-slate-700 text-gray-900 dark:text-white border-emerald-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-400"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={form.Email}
              onChange={(e) => setForm({ ...form, Email: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg bg-emerald-50 dark:bg-slate-700 text-gray-900 dark:text-white border-emerald-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              value={form.Password}
              onChange={(e) => setForm({ ...form, Password: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg bg-emerald-50 dark:bg-slate-700 text-gray-900 dark:text-white border-emerald-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-400"
              placeholder="Choose a password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select
              value={form.Role}
              onChange={(e) => setForm({ ...form, Role: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-emerald-50 dark:bg-slate-700 text-gray-900 dark:text-white border-emerald-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-400"
            >
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-2 rounded-lg transition shadow-md"
          >
            Register
          </button>
        </form>

        <p className="text-sm mt-6 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline font-medium">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const syncRole = () => {
      setRole(localStorage.getItem('role') || '');
      setName(localStorage.getItem('name') || '');
    };

    syncRole();
    window.addEventListener('storage', syncRole);
    return () => window.removeEventListener('storage', syncRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 shadow-md px-6 py-4 flex justify-between items-center rounded-b-xl"
    >
      <Link
        to="/dashboard"
        className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-teal-300 dark:to-emerald-400"
      >
        EduSync
      </Link>

      <div className="flex items-center gap-5 text-sm font-semibold text-emerald-900 dark:text-slate-200">
        {role === 'Instructor' && (
          <>
            <Link to="/dashboard" className="hover:text-teal-600 transition">Dashboard</Link>
            <Link to="/courses" className="hover:text-teal-600 transition">Courses</Link>
            <Link to="/assessments" className="hover:text-teal-600 transition">Assessments</Link>
            <Link to="/results" className="hover:text-teal-600 transition">Results</Link>
            <Link to="/students" className="hover:text-teal-600 transition">Students</Link>
          </>
        )}

        {role === 'Student' && (
          <>
            <Link to="/dashboard" className="hover:text-teal-600 transition">Dashboard</Link>
            <Link to="/student/courses" className="hover:text-teal-600 transition">Courses</Link>
            <Link to="/student/results" className="hover:text-teal-600 transition">My Results</Link>
          </>
        )}

        {name && (
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            className="ml-4 px-4 py-1.5 rounded-lg text-white font-medium bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-md transition"
          >
            Logout
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;

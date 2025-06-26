import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ClipboardCheck,
  BarChart2,
  LayoutGrid,
  UserCircle,
} from 'lucide-react';

const DashboardPage = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    setName(localStorage.getItem('name') || '');
    setRole(localStorage.getItem('role') || 'Student'); // Default fallback
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  };

  const dashboardCards = {
    Instructor: [
      {
        to: '/courses',
        label: 'Manage Courses',
        gradient: 'from-emerald-400 via-mint-400 to-teal-400',
        icon: <BookOpen size={30} />,
      },
      {
        to: '/assessments',
        label: 'Manage Assessments',
        gradient: 'from-lime-400 via-green-400 to-emerald-500',
        icon: <ClipboardCheck size={30} />,
      },
      {
        to: '/results',
        label: 'View Results',
        gradient: 'from-teal-400 via-green-500 to-emerald-600',
        icon: <BarChart2 size={30} />,
      },
    ],
    Student: [
      {
        to: '/student/courses',
        label: 'Browse Courses',
        gradient: 'from-mint-400 via-teal-400 to-emerald-400',
        icon: <LayoutGrid size={30} />,
      },
      {
        to: '/student/results',
        label: 'My Results',
        gradient: 'from-green-400 via-emerald-500 to-lime-500',
        icon: <BarChart2 size={30} />,
      },
      {
        to: '/profile',
        label: 'My Profile',
        gradient: 'from-emerald-400 via-mint-400 to-teal-400',
        icon: <UserCircle size={30} />,
      },
    ],
  };

  const roleCards = dashboardCards[role] || [];

  return (
    <motion.div
      className="px-4 py-10 sm:px-6 lg:px-12 max-w-7xl mx-auto bg-gradient-to-br from-white via-green-50 to-emerald-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-2xl shadow-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text drop-shadow-md">
        Welcome, {name || 'User'}!
      </h1>
      <p className="text-center text-lg text-slate-700 dark:text-slate-300 mb-12">
        You are logged in as <strong>{role}</strong>. Let’s get started!
      </p>

      {roleCards.length === 0 ? (
        <p className="text-center text-slate-600 dark:text-slate-300">
          ⚠️ No dashboard options available for this role.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {roleCards.map((item, i) => (
            <motion.div
              key={item.to}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl p-[1px] bg-gradient-to-br from-green-200 via-emerald-100 to-white dark:from-slate-700 dark:via-slate-800 dark:to-slate-700"
            >
              <Link
                to={item.to}
                className={`block h-full p-6 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-full flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{item.label}</h2>
                    <p className="text-sm opacity-90 mt-1">Click to open</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/5 blur-2xl rounded-full"></div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default DashboardPage;

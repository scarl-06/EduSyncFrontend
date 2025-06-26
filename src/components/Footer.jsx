import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mt-10 shadow-inner"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 via-green-200 to-teal-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
      <div className="absolute inset-0 bg-blur" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-4 text-center text-sm text-emerald-900 dark:text-slate-400 font-medium">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-teal-300 dark:to-emerald-400"
        >
          © {new Date().getFullYear()} EduSync LMS
        </motion.span>{' '}
        — All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;

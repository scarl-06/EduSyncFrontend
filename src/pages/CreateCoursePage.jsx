import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setUserRole(localStorage.getItem('role'));
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/Courses');
      setCourses(response.data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('⚠️ Failed to fetch courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-white via-green-50 to-emerald-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-2xl shadow-xl mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
          Available Courses
        </h2>

        {userRole === 'Instructor' && (
          <a
            href="/courses/create"
            className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition"
          >
            ➕ Add New Course
          </a>
        )}
      </div>

      {/* Status Message */}
      {loading ? (
        <p className="text-slate-600 dark:text-slate-300">Loading courses...</p>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400">{error}</p>
      ) : courses.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-300">No courses found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <motion.div
              key={course.CourseId}
              className="p-5 border border-green-200 dark:border-slate-700 rounded-2xl bg-green-50 dark:bg-slate-800 shadow-md hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
                {course.Title || 'Untitled Course'}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                {course.Description || 'No description provided.'}
              </p>
              {course.InstructorName && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Instructor:</strong> {course.InstructorName}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CoursesPage;

import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const StudentCourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await api.get('/Course');
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAssessments = (courseId) => {
    if (!courseId) {
      alert('Invalid course ID');
      return;
    }
    navigate(`/student/courses/${courseId}/assessments`);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 text-center">
        Available Courses
      </h2>

      {loading ? (
        <p className="text-center text-slate-600 dark:text-slate-300">⏳ Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400">No courses available.</p>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 }
            },
          }}
        >
          {courses.map((course, index) => (
            <motion.div
              key={course.courseId}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-emerald-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                {course.title || 'Untitled Course'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {course.description || 'No description available.'}
              </p>
              <button
                onClick={() => handleViewAssessments(course.courseId)}
                className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold py-2 rounded-lg text-sm transition shadow"
              >
                📘 View Assessments
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudentCourseListPage;

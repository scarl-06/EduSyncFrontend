import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    mediaUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchCourses = async () => {
    try {
      const res = await api.get('/Course');
      setCourses(res.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const isValidUrl = (url) =>
    url === '' || /^https?:\/\/.+/.test(url);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!form.title.trim()) {
      setMessage({ type: 'error', text: 'Course title is required.' });
      return;
    }

    if (!isValidUrl(form.mediaUrl)) {
      setMessage({ type: 'error', text: 'Media URL must be valid.' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        instructorId: localStorage.getItem('userId'),
      };

      await api.post('/Course', payload);
      setForm({ title: '', description: '', mediaUrl: '' });
      setMessage({ type: 'success', text: 'Course created successfully.' });
      fetchCourses();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error creating course:', error);
      setMessage({ type: 'error', text: 'Failed to create course. Check console.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <motion.div
      className="px-4 sm:px-6 py-6 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-teal-300 dark:to-emerald-400 text-center">
        Manage Courses
      </h2>

      {/* Message */}
      {message.text && (
        <div
          className={`text-sm font-medium text-center px-4 py-2 mb-4 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Create Course Form */}
      <motion.form
        onSubmit={handleCreateCourse}
        className="space-y-4 mb-12 bg-gradient-to-br from-white via-green-50 to-mint-100 dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl shadow-lg border border-green-200 dark:border-slate-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-2 text-emerald-700 dark:text-green-300">Create New Course</h3>
        <input
          type="text"
          placeholder="Title"
          className="w-full px-4 py-2 rounded border border-green-200 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full px-4 py-2 rounded border border-green-200 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Media URL (https://...)"
          className="w-full px-4 py-2 rounded border border-green-200 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
          value={form.mediaUrl}
          onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-md font-semibold transition shadow-md flex items-center justify-center"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            '➕ Create Course'
          )}
        </button>
      </motion.form>

      {/* Course Cards */}
      {courses.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-slate-300">No courses found.</p>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {courses.map((course) => (
            <motion.div
              key={course.courseId}
              className="bg-white dark:bg-slate-800 p-5 border border-green-100 dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="text-lg font-semibold text-emerald-700 dark:text-green-300">{course.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                {course.description || 'No description'}
              </p>
              {course.mediaUrl && (
                <a
                  href={course.mediaUrl}
                  className="text-sm text-green-500 hover:underline transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📺 View Media
                </a>
              )}

              <div className="mt-4 flex gap-4">
                <Link
                  to={`/courses/edit/${course.courseId}`}
                  className="text-sm text-teal-600 hover:text-teal-800 font-medium underline"
                >
                  ✏️ Edit
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CoursesPage;

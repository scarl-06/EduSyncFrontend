import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    mediaUrl: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/Course/${id}`);
        if (res?.data) {
          const { title = '', description = '', mediaUrl = '' } = res.data;
          setForm({ title, description, mediaUrl });
        } else {
          throw new Error('Invalid course data.');
        }
      } catch (err) {
        console.error('Failed to load course:', err);
        setErrorMessage('Course not found or failed to load.');
      }
    };
    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isValidUrl = (url) => {
    try {
      if (!url) return true; // allow empty
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isValidUrl(form.mediaUrl)) {
      setErrorMessage('❗ Media URL is not valid.');
      return;
    }

    try {
      const payload = {
        ...form,
        instructorId: localStorage.getItem('userId'),
      };
      console.log("🔄 Submitting course update:", payload);

      await api.put(`/Course/${id}`, payload);
      navigate('/courses');
    } catch (err) {
      console.error('❌ Failed to update course:', err);
      setErrorMessage('Failed to update course. Please try again.');
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white via-green-50 to-emerald-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 shadow-xl p-6 rounded-2xl max-w-xl mx-auto mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
        📚 Edit Course
      </h2>

      {errorMessage && (
        <div className="text-red-600 dark:text-red-400 font-medium mb-4 text-center">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Title
          </label>
          <input
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-green-300 dark:border-slate-600 rounded bg-green-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-green-300 dark:border-slate-600 rounded bg-green-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Media URL
          </label>
          <input
            name="mediaUrl"
            type="url"
            value={form.mediaUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-green-300 dark:border-slate-600 rounded bg-green-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-400"
            placeholder="https://example.com/video"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2.5 rounded-lg font-semibold transition shadow-md"
        >
          💾 Save Changes
        </button>
      </form>
    </motion.div>
  );
};

export default EditCoursePage;

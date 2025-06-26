import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const EditAssessmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    courseId: '',
    title: '',
    maxScore: 100,
    questions: '',
  });

  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessmentRes, coursesRes] = await Promise.all([
          api.get(`/Assessments/${id}`),
          api.get('/Course'),
        ]);

        const a = assessmentRes.data;
        setForm({
          courseId: a.courseId || '',
          title: a.title || '',
          maxScore: a.maxScore || 100,
          questions: a.questions || '',
        });

        setCourses(coursesRes.data);
      } catch (err) {
        console.error('Error loading assessment or courses:', err);
        setErrorMessage('Failed to load assessment or courses. Please try again later.');
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateAssessment = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      JSON.parse(form.questions); // Validate JSON format
      const payload = {
        ...form,
        question: form.questions, // in case backend uses `question`
      };

      await api.put(`/Assessments/${id}`, payload);
      navigate('/assessments');
    } catch (error) {
      setErrorMessage('❗ Please enter valid JSON format in the "Questions" field.');
      console.error('Update failed:', error);
    }
  };

  return (
    <motion.div
      className="p-6 max-w-3xl mx-auto bg-gradient-to-br from-white via-green-50 to-emerald-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-xl shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
        ✏️ Edit Assessment
      </h2>

      {errorMessage && (
        <p className="text-red-600 dark:text-red-400 font-medium mb-4 text-center">{errorMessage}</p>
      )}

      <form
        onSubmit={handleUpdateAssessment}
        className="space-y-4 bg-white dark:bg-slate-800 p-6 rounded-xl shadow border dark:border-slate-700"
      >
        <select
          name="courseId"
          value={form.courseId}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border border-green-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-400"
          required
        >
          <option value="">Select a course</option>
          {courses.length === 0 ? (
            <option disabled>No courses available</option>
          ) : (
            courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.title}
              </option>
            ))
          )}
        </select>

        <input
          type="text"
          name="title"
          placeholder="Assessment Title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-green-300 dark:border-slate-600 rounded dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-400"
          required
        />

        <textarea
          name="questions"
          placeholder="Questions (as JSON)"
          value={form.questions}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-green-300 dark:border-slate-600 rounded dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-400"
          rows={6}
          required
        />

        <input
          type="number"
          name="maxScore"
          placeholder="Max Score"
          value={form.maxScore}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-green-300 dark:border-slate-600 rounded dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-400"
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2.5 rounded-md font-semibold transition shadow-md"
        >
          💾 Update Assessment
        </button>
      </form>
    </motion.div>
  );
};

export default EditAssessmentPage;

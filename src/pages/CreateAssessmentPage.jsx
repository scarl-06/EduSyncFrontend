import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CreateAssessmentPage = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: '',
    questions: '',
    maxScore: '',
    courseId: ''
  });
  const [isJsonValid, setIsJsonValid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/Course')
      .then(res => setCourses(res.data))
      .catch(err => console.error('Failed to load courses', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'questions') {
      try {
        JSON.parse(value);
        setIsJsonValid(true);
      } catch {
        setIsJsonValid(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isJsonValid) {
      alert('❗ Invalid JSON format in Questions.');
      return;
    }

    try {
      const parsedQuestions = JSON.parse(form.questions);

      const payload = {
        Title: form.title,
        Question: JSON.stringify(parsedQuestions),
        MaxScore: parseInt(form.maxScore, 10),
        CourseId: form.courseId
      };

      await api.post('/Assessments', payload);
      navigate('/assessments');
    } catch (err) {
      console.error('Failed to create assessment', err);
      alert('❗ Something went wrong. Please check the inputs.');
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white via-green-50 to-emerald-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-8 rounded-2xl max-w-2xl mx-auto mt-10 shadow-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 text-center">
        Create New Assessment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-green-200 dark:border-slate-600 rounded-lg bg-green-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="Enter assessment title"
          />
        </div>

        {/* Questions */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Questions (JSON Format)
          </label>
          <textarea
            name="questions"
            value={form.questions}
            onChange={handleChange}
            required
            rows={5}
            className={`w-full px-4 py-2 border ${
              isJsonValid ? 'border-green-200 dark:border-slate-600' : 'border-red-500'
            } rounded-lg bg-green-50 dark:bg-slate-700 text-slate-900 dark:text-white`}
            placeholder={`[
  {
    "questionText": "What is 2 + 2?",
    "options": ["1", "2", "4", "5"],
    "correctAnswer": "4"
  }
]`}
          />
          {!isJsonValid && (
            <p className="text-red-500 text-sm mt-1">⚠️ Invalid JSON format</p>
          )}
        </div>

        {/* Max Score */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Max Score</label>
          <input
            type="number"
            name="maxScore"
            value={form.maxScore}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-green-200 dark:border-slate-600 rounded-lg bg-green-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="Enter max score"
          />
        </div>

        {/* Course Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Course</label>
          <select
            name="courseId"
            value={form.courseId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-green-200 dark:border-slate-600 rounded-lg bg-green-50 dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="">-- Select a course --</option>
            {courses.map((c) => (
              <option key={c.courseId || c.CourseId} value={c.courseId || c.CourseId}>
                {c.title || c.Title}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-2 rounded-lg transition shadow-lg"
        >
          ➕ Create Assessment
        </button>
      </form>
    </motion.div>
  );
};

export default CreateAssessmentPage;

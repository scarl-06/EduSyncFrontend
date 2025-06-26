import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    courseId: '',
    title: '',
    maxScore: 100,
    questions: '',
  });

  const navigate = useNavigate();

  const fetchAssessments = async () => {
    try {
      const res = await api.get('/Assessments');
      setAssessments(res.data);
    } catch (err) {
      console.error('Failed to fetch assessments', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get('/Course');
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  };

  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    try {
      const parsedQuestions = JSON.parse(form.questions);

      const questionText = parsedQuestions
        .map((q, index) => {
          const opts = q.options?.join(', ') || '';
          return `Q${index + 1}: ${q.questionText}\nOptions: ${opts}\nAnswer: ${q.correctAnswer}`;
        })
        .join('\n\n');

      const payload = {
        courseId: form.courseId,
        title: form.title,
        maxScore: form.maxScore,
        question: questionText,
      };

      await api.post('/Assessments', payload);
      setForm({ courseId: '', title: '', maxScore: 100, questions: '' });
      fetchAssessments();
    } catch (error) {
      if (error instanceof SyntaxError) {
        alert('❗ Please enter valid JSON for the Questions field.');
      } else {
        console.error('Failed to create assessment', error);
        alert('Failed to create assessment. Check console.');
      }
    }
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;
    try {
      await api.delete(`/Assessments/${assessmentId}`);
      fetchAssessments();
    } catch (error) {
      console.error('Failed to delete assessment:', error);
      alert('Error deleting assessment. Check console.');
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchAssessments();
  }, []);

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-teal-300 dark:to-emerald-400 text-center">
        Manage Assessments
      </h2>

      {/* Create Assessment Form */}
      <motion.form
        onSubmit={handleCreateAssessment}
        className="space-y-4 mb-12 bg-gradient-to-br from-white via-emerald-50 to-teal-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg border dark:border-gray-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-2 text-emerald-700 dark:text-emerald-300">Create New Assessment</h3>

        <select
          value={form.courseId}
          onChange={(e) => setForm({ ...form, courseId: e.target.value })}
          className="w-full px-4 py-2 rounded border border-emerald-200 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white"
          required
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Assessment Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-2 border border-emerald-200 dark:border-gray-700 rounded dark:bg-gray-800 text-gray-900 dark:text-white"
          required
        />

        <textarea
          placeholder={`[
  {
    "questionText": "What is 2 + 2?",
    "options": ["1", "2", "4", "5"],
    "correctAnswer": "4"
  }
]`}
          value={form.questions}
          onChange={(e) => setForm({ ...form, questions: e.target.value })}
          className="w-full px-4 py-2 border border-emerald-200 dark:border-gray-700 rounded dark:bg-gray-800 text-gray-900 dark:text-white"
          rows={5}
          required
        />

        <input
          type="number"
          placeholder="Max Score"
          value={form.maxScore}
          onChange={(e) => setForm({ ...form, maxScore: e.target.value })}
          className="w-full px-4 py-2 border border-emerald-200 dark:border-gray-700 rounded dark:bg-gray-800 text-gray-900 dark:text-white"
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2.5 rounded-md font-semibold transition shadow-md"
        >
          ➕ Create Assessment
        </button>
      </motion.form>

      {/* Assessment Cards */}
      {assessments.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No assessments found.</p>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {assessments.map((a) => {
            const course = courses.find((c) => c.courseId === a.courseId);
            return (
              <motion.div
                key={a.assessmentId}
                className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-5 border border-emerald-100 dark:border-gray-700 hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h4 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                  {a.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Course: <span className="font-medium">{course?.title || 'Unknown'}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Max Score: <span className="font-medium">{a.maxScore}</span>
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => navigate(`/assessments/edit/${a.assessmentId}`)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 text-sm rounded transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAssessment(a.assessmentId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AssessmentsPage;

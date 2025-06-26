import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

const AssessmentResultsPage = () => {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState('Assessment');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [titleRes, resultsRes] = await Promise.all([
          api.get(`/Assessments/${id}`),
          api.get(`/Results/Assessment/${id}`),
        ]);

        setTitle(titleRes.data?.title || 'Assessment');
        setResults(resultsRes.data);
        setError('');
      } catch (err) {
        console.error('Error fetching assessment or results:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <motion.div
      className="p-6 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-6 text-center">
        Results for: {title}
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading results...</p>
      ) : error ? (
        <p className="text-center text-red-600 dark:text-red-400">{error}</p>
      ) : results.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-600 dark:text-gray-300"
        >
          No results found for this assessment.
        </motion.p>
      ) : (
        <motion.div
          className="overflow-x-auto bg-white dark:bg-gray-900 shadow-xl rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <table className="table-auto w-full border-separate border-spacing-y-2 px-4 py-2">
            <thead>
              <tr className="text-left bg-emerald-100 dark:bg-gray-800 rounded">
                <th className="py-3 px-4 rounded-l-xl text-emerald-700 dark:text-emerald-300">#</th>
                <th className="py-3 px-4 text-emerald-700 dark:text-emerald-300">Student</th>
                <th className="py-3 px-4 text-emerald-700 dark:text-emerald-300">Score</th>
                <th className="py-3 px-4 rounded-r-xl text-emerald-700 dark:text-emerald-300">Attempt Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, index) => (
                <motion.tr
                  key={r.resultId || `${r.userName}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-emerald-50 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all rounded-lg text-sm shadow-sm"
                >
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-100">{index + 1}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-100">{r.userName}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-700 dark:text-emerald-400">{r.score}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {r.attemptDate ? new Date(r.attemptDate).toLocaleString('en-IN') : 'N/A'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AssessmentResultsPage;

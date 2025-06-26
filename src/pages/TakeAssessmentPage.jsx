import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const TakeAssessmentPage = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resultSubmitted, setResultSubmitted] = useState(false);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    if (!token) throw new Error('No authentication token found. Please log in again.');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const parseFormattedQuestions = (questionText) => {
    if (!questionText || questionText.trim() === '') return [];
    const questionBlocks = questionText.split('\n\n').filter(block => block.trim() !== '');
    const parsedQuestions = [];

    for (const block of questionBlocks) {
      const lines = block.split('\n').map(line => line.trim()).filter(line => line !== '');
      if (lines.length < 3) continue;
      try {
        const questionText = lines[0].replace(/^Q\d+:\s*/, '').trim();
        const optionsLine = lines.find(line => line.startsWith('Options:'));
        if (!optionsLine) continue;
        const optionsText = optionsLine.replace(/^Options:\s*/, '').trim();
        const options = optionsText.split(',').map(opt => opt.trim()).filter(opt => opt !== '');
        const answerLine = lines.find(line => line.startsWith('Answer:'));
        if (!answerLine) continue;
        const correctAnswer = answerLine.replace(/^Answer:\s*/, '').trim();

        if (questionText && options.length > 0 && correctAnswer) {
          parsedQuestions.push({ questionText, options, correctAnswer });
        }
      } catch (err) {
        console.warn('Failed to parse question block:', block, err);
        continue;
      }
    }

    return parsedQuestions;
  };

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        setError(null);
        const headers = getAuthHeaders();
        const res = await api.get(`/Assessments/${id}`, { headers });
        setAssessment(res.data);

        let parsedQuestions = [];
        if (res.data.question) {
          try {
            parsedQuestions = JSON.parse(res.data.question);
            if (!Array.isArray(parsedQuestions)) parsedQuestions = [];
          } catch {
            parsedQuestions = parseFormattedQuestions(res.data.question);
          }
        }

        setQuestions(parsedQuestions);
        setStartTime(Date.now());
      } catch (err) {
        console.error('Failed to load assessment', err);
        if (err.response?.status === 401) setError('Authentication failed. Please log in again.');
        else if (err.response?.status === 403) setError('You don\'t have permission to access this assessment.');
        else if (err.message.includes('No authentication token')) setError(err.message);
        else setError('Failed to load assessment. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAssessment();
  }, [id]);

  const handleOptionSelect = (qIndex, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = async () => {
    if (submitted || questions.length === 0) return;

    try {
      let correct = 0;
      questions.forEach((q, i) => {
        if (answers[i] === q.correctAnswer) correct++;
      });

      const calculatedScore = Math.round((correct / questions.length) * assessment.maxScore);
      setScore(calculatedScore);
      setSubmitted(true);

      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      const resultData = {
        assessmentId: assessment.assessmentId,
        assessmentTitle: assessment.title,
        score: calculatedScore,
        maxScore: assessment.maxScore,
        timeTaken,
        attemptDate: new Date().toISOString(),
        questions: questions.length,
        correctAnswers: correct
      };

      try {
        const existingResults = JSON.parse(localStorage.getItem('userResults') || '[]');
        existingResults.push(resultData);
        localStorage.setItem('userResults', JSON.stringify(existingResults));
      } catch (storageErr) {
        console.warn('Failed to store result locally:', storageErr);
      }

      try {
        const headers = getAuthHeaders();
        await api.post('/Results', {
          assessmentId: assessment.assessmentId,
          userId: localStorage.getItem('userId'),
          score: calculatedScore,
          attemptDate: new Date().toISOString(),
          timeTaken,
        }, { headers });

        setResultSubmitted(true);
      } catch (submitErr) {
        console.warn('Failed to submit to backend:', submitErr);
        setResultSubmitted(false);
      }

    } catch (err) {
      console.error('Failed to process assessment result:', err);
      alert('Failed to process your assessment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <h3 className="font-bold mb-2">Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!assessment) return <p className="p-6 text-slate-500">Loading assessment...</p>;

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 mb-6 text-center">
        {assessment.title}
      </h2>

      {submitted && (
        <motion.div
          className="text-center bg-green-50 dark:bg-slate-800 p-6 rounded-xl shadow-md mb-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <p className="text-xl text-emerald-600 dark:text-green-400 font-semibold mb-2">
            🎉 You scored <strong>{score}</strong> / {assessment.maxScore}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            ⏱️ Time Taken: {Math.floor((Date.now() - startTime) / 1000)} seconds
          </p>
          {!resultSubmitted && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mb-3">
              ℹ️ Result saved locally (backend submission may require instructor permissions)
            </p>
          )}
          <button
            onClick={() => navigate('/student/results')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-5 rounded-lg transition"
          >
            View My Results
          </button>
        </motion.div>
      )}

      {questions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
            No questions found for this assessment.
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            The assessment may not have been set up properly or the questions are in an unsupported format.
          </p>
        </div>
      ) : (
        <>
          <motion.form className="space-y-6">
            {questions.map((q, index) => {
              const selected = answers[index];
              const isCorrect = selected === q.correctAnswer;

              return (
                <motion.div
                  key={index}
                  className={`p-5 rounded-xl shadow border transition ${
                    submitted
                      ? isCorrect
                        ? 'bg-green-50 border-green-300 dark:bg-green-900 dark:border-green-700'
                        : 'bg-red-50 border-red-300 dark:bg-red-900 dark:border-red-700'
                      : 'bg-emerald-50 border-emerald-200 dark:bg-slate-800 dark:border-slate-700'
                  }`}
                >
                  <h3 className="font-semibold mb-3 text-teal-700 dark:text-teal-300">
                    Q{index + 1}. {q.questionText}
                  </h3>
                  <div className="space-y-2">
                    {q.options && q.options.map((option, oIndex) => (
                      <label
                        key={oIndex}
                        className={`flex items-center gap-2 text-sm cursor-pointer ${
                          submitted && option === q.correctAnswer
                            ? 'text-green-700 dark:text-green-300'
                            : submitted && option === selected && option !== q.correctAnswer
                            ? 'text-red-600 dark:text-red-300'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          disabled={submitted}
                          checked={selected === option}
                          onChange={() => handleOptionSelect(index, option)}
                          className="accent-emerald-600"
                        />
                        {option}
                      </label>
                    ))}
                  </div>

                  {submitted && selected !== q.correctAnswer && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      Correct Answer: <strong>{q.correctAnswer}</strong>
                    </p>
                  )}
                </motion.div>
              );
            })}
          </motion.form>

          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length === 0}
              className={`mt-8 block mx-auto px-6 py-2 rounded-lg transition font-semibold ${
                Object.keys(answers).length === 0
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              Submit Assessment
            </button>
          )}
        </>
      )}
    </motion.div>
  );
};

export default TakeAssessmentPage;

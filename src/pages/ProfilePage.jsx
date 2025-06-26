import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
  const userId = localStorage.getItem('userId');
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '' });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/UserModels/${userId}`);
        setProfile(res.data);
        setForm({
          fullName: res.data.fullName || '',
          email: res.data.email || ''
        });
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/UserModels/${userId}`, {
        userId,
        fullName: form.fullName,
        email: form.email
      });
      setProfile({ ...form, userId });
      setEditMode(false);
      setSuccessMsg('✅ Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Update failed.');
    }
  };

  if (!profile) {
    return <p className="p-6 text-emerald-600 dark:text-emerald-300">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-100 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-3xl p-8 border border-emerald-200 dark:border-slate-700"
      >
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 text-center mb-6">
          My Profile
        </h2>

        {successMsg && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300 border border-green-300 dark:border-green-700 rounded px-4 py-2 text-sm mb-4"
          >
            {successMsg}
          </motion.p>
        )}

        <AnimatePresence mode="wait">
          {editMode ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <input
                    className="w-full px-4 py-2 rounded-xl border border-emerald-200 dark:border-slate-600 bg-emerald-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-xl border border-emerald-200 dark:border-slate-600 bg-emerald-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="static"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4 text-gray-800 dark:text-gray-200"
            >
              <p><strong>Full Name:</strong> {profile.fullName}</p>
              <p><strong>Email:</strong> {profile.email}</p>

              <div className="text-center mt-6">
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition shadow-md"
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProfilePage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', email: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
  oldPassword: '',
  newPassword: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
        setForm({ username: res.data.username, email: res.data.email });
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        'http://localhost:5000/api/user/profile',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.msg);
      setUser(res.data.user);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Could not update profile');
    }
  };

  const handleChangePassword = async () => {
  try {
    const res = await axios.put(
      'http://localhost:5000/api/user/change-password',
      passwordForm,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert(res.data.msg);
    setPasswordForm({ oldPassword: '', newPassword: '' });
    setShowPasswordForm(false);
  } catch (err) {
    console.error('Error changing password:', err);
    alert(err.response?.data?.msg || 'Error changing password');
  }
};

   if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
       <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Profile 👤</h2>

      {editMode ? (
        <div className="space-y-4">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Username"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Email"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Username</label>
          <p className="mt-1 text-gray-800">{user.username || 'Not set'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <p className="mt-1 text-gray-800">{user.email}</p>
        </div>
        
          <button
            onClick={() => setEditMode(true)}
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
           className="block text-sm font-medium text-gray-600 mb-1"
            >
            {showPasswordForm ? 'Cancel Change Password' : 'Change Password'}
            </button>
            {showPasswordForm && (
                <div className="mt-4 space-y-3">
                    <input
                    type="password"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                        setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                    }
                    placeholder="Old Password"
                    className="w-full border p-2 rounded"
                    />
                    <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    placeholder="New Password"
                    className="w-full border p-2 rounded"
                    />
                    <button
                    onClick={handleChangePassword}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                    Update Password
                    </button>
                </div>
                )}


        </div>
      )}
    </div>
  );
};

export default Profile;

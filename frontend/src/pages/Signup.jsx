import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const API_BASE = "http://localhost:3000";

  const handleGoogleSignup = () => {
    window.location.href = `${API_BASE}/users/oauth/google`;
  };

  const handleMicrosoftSignup = () => {
    window.location.href = `${API_BASE}/users/oauth/microsoft`;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password || !form.firstName) { setError('Name, email and password required'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    try {
      const result = await signup({ firstName: form.firstName, lastName: form.lastName, email: form.email, username: form.username || form.email.split('@')[0], password: form.password, role: 'PENDING' });

      // if signup returned a stored user (with token), decide where to navigate
      if (result && result.role) {
        const role = (result.role || '').toLowerCase();
        if (role === 'pending') {
          navigate('/pending');
        } else {
          navigate(`/${role}`);
        }
      } else {
        // fallback: show message and stay
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors">

      <div className="w-full max-w-md bg-gray-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">

        {/* ICON */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="bg-indigo-100 dark:bg-indigo-950 p-3 sm:p-4 rounded-full">
            <span className="text-indigo-600 dark:text-indigo-400 text-2xl sm:text-3xl">👤</span>
          </div>
        </div>

        {/* TITLE */}
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-slate-50 mb-2">
          Sign up
        </h2>
          <p className="text-center text-sm text-gray-600 dark:text-slate-300 mb-6 sm:mb-8">
          Create your account
        </p>

        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition"
          >
            <FcGoogle size={20} />
            Sign up with Google
          </button>

          <button
            type="button"
            onClick={handleMicrosoftSignup}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition"
          >
            <FaMicrosoft size={18} className="text-blue-600" />
            Sign up with Microsoft
          </button>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px bg-gray-300 dark:bg-slate-600 flex-1" />
          <span className="text-xs text-gray-500 dark:text-slate-400">OR</span>
          <div className="h-px bg-gray-300 dark:bg-slate-600 flex-1" />
        </div>

        {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

          {/* First Name */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-200 mb-1.5 sm:mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gray-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-200 mb-1.5 sm:mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gray-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
            />
          </div>


          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-200 mb-1.5 sm:mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gray-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
            />
          </div>

          {/* USERNAME */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-200 mb-1.5 sm:mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gray-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
            />
          </div>


          {/* Password */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-200 mb-1.5 sm:mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gray-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-200 mb-1.5 sm:mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Confirm your password"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gray-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
            />
          </div>

          {/* Submit Button */}
            {error && <div className="text-xs sm:text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 p-3 rounded-lg">{error}</div>}
          <button
            type="submit"
              className="w-full bg-black dark:bg-indigo-600 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-900 dark:hover:bg-indigo-700 transition text-sm sm:text-base"
          >
            Sign up
          </button>

        </form>

        {/* LOGIN LINK */}
  <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-slate-300 mt-4 sm:mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            Login
          </Link>
        </p>

        {/* BACK TO HOME */}
        <p className="text-center text-sm text-gray-500 mt-3">
          <Link to="/" className="hover:underline">
            Back to home page
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Signup;
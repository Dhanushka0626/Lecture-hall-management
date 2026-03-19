import { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const oauthError = searchParams.get("oauthError");
  const API_BASE = "http://localhost:3000";

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/users/oauth/google`;
  };

  const handleMicrosoftLogin = () => {
    window.location.href = `${API_BASE}/users/oauth/microsoft`;
  };

  // Auto redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }
    // call real login
    try {
      const user = await login({ email, password });
      const role = (user.role || '').toLowerCase();
      if (role === 'pending') {
        navigate('/pending');
      } else {
        navigate(`/${role}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors">
      <div className="w-full max-w-md bg-gray-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">

        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 dark:text-slate-50">
          Login
        </h2>

        {(error || oauthError) && (
       <div className="mb-4 text-xs sm:text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 p-3 rounded-lg">
            {error || oauthError}
          </div>
        )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-slate-200">
              Email or Username
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Enter your Email or Username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-slate-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black dark:bg-indigo-600 text-white py-3 rounded-lg hover:bg-gray-900 dark:hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm mt-3 text-gray-600 dark:text-slate-300">
          <Link to="/forgot-password" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Forgot your password?
          </Link>
        </p>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px bg-gray-300 dark:bg-slate-600 flex-1" />
          <span className="text-xs text-gray-500 dark:text-slate-400">OR</span>
          <div className="h-px bg-gray-300 dark:bg-slate-600 flex-1" />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition"
          >
            <FcGoogle size={20} />
            Sign in with Google
          </button>

          <button
            type="button"
            onClick={handleMicrosoftLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition"
          >
            <FaMicrosoft size={18} className="text-blue-600" />
            Sign in with Microsoft
          </button>
        </div>

        

        <p className="text-center text-sm mt-4 dark:text-slate-300">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
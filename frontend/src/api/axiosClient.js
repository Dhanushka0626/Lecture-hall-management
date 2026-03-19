import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  // Support token stored either as `token` key or inside `user.token`.
  const token = localStorage.getItem("token") || (() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      return u?.token;
    } catch (e) {
      return null;
    }
  })();

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default axiosClient;
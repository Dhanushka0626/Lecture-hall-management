import API from "../api/axiosClient";

const userService = {
  getProfile: async () => {
    const res = await API.get('/users/me');
    return res.data;
  },

  updateProfile: async (payload) => {
    const res = await API.put('/users/me', payload);
    return res.data;
  },

  changePassword: async (payload) => {
    const res = await API.put('/users/change-password', payload);
    return res.data;
  },

  forgotPassword: async (identifier) => {
    const res = await API.post('/users/forgot-password', { email: identifier });
    return res.data;
  },

  resetPassword: async (token, newPassword) => {
    const res = await API.post(`/users/reset-password/${token}`, { newPassword });
    return res.data;
  }
};

export default userService;

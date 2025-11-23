import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/client";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"));
  const isLoading = ref(false);
  const error = ref(null);
  const isAuthenticated = ref(!!localStorage.getItem("auth_token"));

  async function signup(payload) {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await api.post("auth/signup", payload, { skipAuth: true });
      const token = res.data.token;
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      user.value = res.data.user;
      isAuthenticated.value = true;
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data || err.message || 'Signup failed'
      error.value = typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg)
      throw err
    } finally {
      isLoading.value = false;
    }
  }

  async function login(payload) {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await api.post("auth/login", payload, { skipAuth: true });
      const token = res.data.token;
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      user.value = res.data.user;
      isAuthenticated.value = true;
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data || err.message || 'Login failed'
      error.value = typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg)
      throw err
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMe() {
    isLoading.value = true
    error.value = null
    try {
      const res = await api.get('auth/me')
      user.value = res.data
      localStorage.setItem('user', JSON.stringify(res.data))
      isAuthenticated.value = true
      return res.data
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data || err.message || 'Failed to fetch profile'
      error.value = typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg)
      // if unauthorized, clear stored auth
      if (err.response && err.response.status === 401) {
        logout()
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    user.value = null;
    isAuthenticated.value = false;
  }

  return { user, isLoading, error, isAuthenticated, signup, login, logout };
});

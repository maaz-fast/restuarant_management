import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/client";

export const useAuthStore = defineStore("auth", () => {
  const userString = localStorage.getItem("user");
  const user = ref(userString && userString !== "undefined" ? JSON.parse(userString) : null);
  const isLoading = ref(false);
  const error = ref(null);
  const isAuthenticated = ref(!!localStorage.getItem("auth_token"));

  async function signup(payload) {
    isLoading.value = true;
    error.value = null;
    try {
      // Map phone to phoneNumber and add role field
      const signupData = {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        phoneNumber: payload.phone,
        role: payload.role || "User",  // Capital U to match backend authorization
        address: payload.address
      };
      const res = await api.post("user/signup", signupData, { skipAuth: true });
      console.log('Signup response:', res.data);
      
      // Check if signup was successful based on status
      if (res.data.status === 'Success') {
        // Extract token and user data if available
        const token = res.data.payload?.responseData?.token || res.data.payload?.token || res.data.token;
        const userData = res.data.payload?.responseData?.user || res.data.payload?.user || res.data.user;
        
        // If token is available, store it
        if (token) {
          console.log('Token saved:', token.substring(0, 20) + '...');
          localStorage.setItem("auth_token", token);
          localStorage.setItem("user", JSON.stringify(userData));
          user.value = userData;
          isAuthenticated.value = true;
        }
        
        return res.data;
      } else {
        throw new Error(res.data.payload?.message || 'Signup failed');
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Signup failed";
      error.value =
        typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function login(payload) {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await api.post("user/login", payload, { skipAuth: true });
      console.log('Login response:', res.data);
      
      // Extract token from response - correct nested structure
      const token = res.data.payload?.responseData?.token || res.data.payload?.token || res.data.token;
      const userData = res.data.payload?.responseData?.user || res.data.payload?.user || res.data.user;
      
      if (!token) {
        throw new Error('No token received from login');
      }
      
      console.log('Token saved:', token.substring(0, 20) + '...');
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      user.value = userData;
      isAuthenticated.value = true;
      return res.data;
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Login failed";
      error.value =
        typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMe() {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await api.get("auth/me");
      user.value = res.data;
      localStorage.setItem("user", JSON.stringify(res.data));
      isAuthenticated.value = true;
      return res.data;
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to fetch profile";
      error.value =
        typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg);
      // if unauthorized, clear stored auth
      if (err.response && err.response.status === 401) {
        logout();
      }
      throw err;
    } finally {
      isLoading.value = false;
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

// external imports
import { create } from 'zustand';

// internal imports
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axios';

const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    // check auth
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/user');
            const data = res.data;

            if (data.statusCode === 200 && data.success) {
                set({ authUser: data.data });
            } else {
                set({ authUser: null });
                console.error(`Error checking auth: ${data.message}`);
            }
        } catch (err) {
            set({ authUser: null });
            console.error(`Error checking auth: ${err.message}`);
            if (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                console.error(`API Error: ${err.response.data.message}`);
            }
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // signup
    signup: async (formData) => {
        set({ isSigningUp: true });
        // toast.loading('Creating account...', { duration: 3000 });

        try {
            const res = await axiosInstance.post('/auth/signup', formData);
            const data = res.data;

            if (data.statusCode === 200 && data.success) {
                set({ authUser: data.data });
                toast.success('Account created successfully');
            }
        } catch (err) {
            toast.error('Error creating account');
            console.error(`Error signing up: ${err.message}`);
            if (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                console.error(`API Error: ${err.response.data.message}`);
            }
        } finally {
            set({ isSigningUp: false });
        }
    },

    // login
    login: async (formData) => {
        set({ isLoggingIn: true });
        // toast.loading('Logging in...', { duration: 3000 });

        try {
            const res = await axiosInstance.post('/auth/login', formData);
            const data = res.data;

            if (data.statusCode === 200 && data.success) {
                set({ authUser: data.data });
                toast.success('Logged in successfully');
            }
        } catch (err) {
            console.error(`Error logging in: ${err.message}`);
            toast.error('Error logging in');
            if (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                console.error(`API Error: ${err.response.data.message}`);
            }
        } finally {
            set({ isLoggingIn: false });
        }
    },

    // logout
    logout: async () => {
        // toast.loading('Logging out...', { duration: 3000 });

        try {
            const res = await axiosInstance.get('/auth/logout');
            const data = res.data;

            if (data.statusCode === 200 && data.success) {
                set({ authUser: null });
                toast.success('Logged out successfully');
            }
        } catch (err) {
            console.error(`Error logging out: ${err.message}`);
            toast.error('An error occurred');
            if (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                console.error(`API Error: ${err.response.data.message}`);
            }
        }
    },
}));

export default useAuthStore;

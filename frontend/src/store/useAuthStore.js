// external imports
import { create } from 'zustand';

// internal imports
import axiosInstance from '../utils/axios';

const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

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

    signup: async (formData) => {
        set({ isSigningUp: true });

        try {
            const res = await axiosInstance.post('/auth/signup', formData);
            const data = res.data;

            if (data.statusCode === 201 && data.success) {
                set({ authUser: data.data });
            } else {
                console.error(`Error signing up: ${data.message}`);
            }
        } catch (err) {
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
}));

export default useAuthStore;

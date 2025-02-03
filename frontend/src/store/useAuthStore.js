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

            if (res.data.statusCode === 200) {
                set({ authUser: res.data.data });
            } else {
                set({ authUser: null });
            }
        } catch (err) {
            set({ authUser: null });
            console.log(`Error checking auth: ${err.message} : ${err.response.data.message}`);
            console.log(err);
        } finally {
            set({ isCheckingAuth: false });
        }
    },
}));

export default useAuthStore;

// external imports
import { create } from 'zustand';

// internal imports
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import axiosInstance from '../utils/axios';

const BASE_URL = import.meta.env.MODE === 'development' ? import.meta.env.VITE_SOCKET_URL : '/';

const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingAvatar: false,
    onlineUsers: [],
    socket: null,

    // check auth
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/user');
            const data = res.data;

            if (data.statusCode === 200 && data.success) {
                set({ authUser: data.data });

                // connect socket
                get().connectSocket();
            }
        } catch (err) {
            set({ authUser: null });
            console.error(`Error checking auth: ${err.message}`);
            if (err.response?.data?.message) {
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

            get().connectSocket();
        } catch (err) {
            toast.error('Error creating account');
            console.error(`Error signing up: ${err.message}`);
            if (err.response?.data?.message) {
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

                // connect socket
                get().connectSocket();
            }
        } catch (err) {
            console.error(`Error logging in: ${err.message}`);
            toast.error('Error logging in');
            if (err.response?.data?.message) {
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

            get().disconnectSocket();
        } catch (err) {
            console.error(`Error logging out: ${err.message}`);
            toast.error('An error occurred');
            if (err.response?.data?.message) {
                console.error(`API Error: ${err.response.data.message}`);
            }
        }
    },

    // update avatar
    updateAvatar: async (avatar) => {
        set({ isUpdatingAvatar: true });
        // toast.loading('Updating avatar...', { duration: 3000 });

        try {
            const res = await axiosInstance.put('/auth/update-avatar', {
                avatar,
            });
            const data = res.data;

            if (data.statusCode === 200 && data.success) {
                set({ authUser: data.data });
                toast.success('Avatar updated successfully');
            }
        } catch (err) {
            console.error(`Error updating avatar: ${err.message}`);
            if (err.status === 413) {
                toast.error('Please upload an image less than 500KB');
            } else {
                toast.error('Error updating avatar');
            }
            if (err.response?.data?.message) {
                console.error(`API Error: ${err.response.data.message}`);
            }
        } finally {
            set({ isUpdatingAvatar: false });
        }
    },

    // connect socket
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) {
            return;
        }

        const socket = io(BASE_URL, {
            query: { userId: authUser._id },
        });
        socket.connect();
        // socket.on('connect', () => {
        //     console.log('Connected to Socket.IO server', socket.id);
        // });
        set({ socket: socket });

        // listen for online users
        socket.on('onlineUsers', (userIds) => {
            set({onlineUsers: userIds})
        });
    },

    // disconnect socket
    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    },
}));

export default useAuthStore;

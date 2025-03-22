// external imports
import toast from 'react-hot-toast';
import { create } from 'zustand';

// internal imports
import axiosInstance from '../utils/axios';

const useChatStore = create((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true });

        try {
            const res = await axiosInstance.get('/message/users');
            const data = res.data;

            if (data.statusCode === 200 && data.success) {
                set({ users: data.data });
            }
        } catch (err) {
            console.error(`Error signing up: ${err.message}`);
            if (err.response?.data?.message) {
                console.error(`API Error: ${err.response.data.message}`);
                toast.error(err.response.data.message);
            } else {
                toast.error('Error fetching users');
            }
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });

        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            const data = res.data;

            if (data.statusCode === 200 && data.success) {
                set({ messages: data.data });
            }
        } catch (err) {
            console.error(`Error fetching messages: ${err.message}`);
            if (err.response?.data?.message) {
                console.error(`API Error: ${err.response.data.message}`);
                toast.error(err.response.data.message);
            } else {
                toast.error('Error fetching messages');
            }
        } finally {
            set({ isMessagesLoading: false})
        }
    }
}));

export default useChatStore;

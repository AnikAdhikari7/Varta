// external imports
import toast from 'react-hot-toast';
import { create } from 'zustand';

// internal imports
import axiosInstance from '../utils/axios';
import useAuthStore from './useAuthStore';

const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
    },

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
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            const data = res.data;

            if (data.statusCode === 200 && data.success) {
                set({ messages: [...messages, data.data] });
            }
        } catch (err) {
            console.error(`Error sending message: ${err.message}`);
            if (err.response?.data?.message) {
                console.error(`API Error: ${err.response.data.message}`);
                toast.error(err.response.data.message);
            } else {
                toast.error('Error sending message');
            }
        }

    },

    subscribeToMessages: () => { 
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on('newMessage', (newMessage) => {
            const isMessageSentFromSelectedUser =
                newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            set({
                messages: [...get().messages, newMessage],
            });
        })
    },

    unsubscribeFromMessages: () => { 
        const socket = useAuthStore.getState().socket;

        socket.off('newMessage');
    }
}));

export default useChatStore;

// external imports
import { create } from 'zustand';

// internal imports

const useThemeStore = create((set) => ({
    theme: localStorage.getItem('theme') || 'dark',
    setTheme: (theme) => {
        localStorage.setItem('theme', theme);
        set({ theme });
    },
}));

export default useThemeStore;
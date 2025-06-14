import { create } from 'zustand';

interface UserInfoStore {
    fullName: string;
    email: string;
    avatar: string;
    createdAt: string;
    totalFiles: number;
    setUser: (user: Partial<Omit<UserInfoStore, 'setUser'>>) => void;
}

export const useUserStore = create<UserInfoStore>(
    (set) => ({
        fullName: '',
        email: '',
        avatar: '',
        createdAt: '',
        totalFiles: 0,
        setUser: (user) => set(() => user),
    })
);
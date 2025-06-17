import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserInfoStore {
    fullName: string;
    email: string;
    avatar: string;
    createdAt: string;
    totalFiles: number;
    setUser: (user: Partial<Omit<UserInfoStore, 'setUser'>>) => void;
}

// Base store configuration
const store = (set: any) => ({
    fullName: '',
    email: '',
    avatar: '',
    createdAt: '',
    totalFiles: 0,
    setUser: (user: Partial<Omit<UserInfoStore, 'setUser'>>) => set(() => user),
});

// Create store with devtools only in development
export const useUserStore = create<UserInfoStore>()(
    
    // redux devtools: dev tools only in development
    process.env.NODE_ENV === 'development'
        ? devtools(
            store, {
                name: 'user-store',     // store-name on the devtools
                enabled: true           // enable devtools in development
            }
        )
        : store                         // return the base store in production
);
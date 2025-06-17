'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/lib/store/user-store'

interface User {
  fullName: string
  email: string
  avatar: string
  createdAt: string
  totalFiles: number
}

// Component to initialize user information in global state
export default function UserInitializer({ user }: { user: User }) {
    
    // Get the function to set user info from Zustand store
    const setUser = useUserStore (
        (state) => state.setUser
    )

    // Store user information in global state when component mounts
    useEffect(() => {
        setUser(user)
    }, [user, setUser])

    // Return null as this is an initialization-only component (no UI rendering)
    return null
}
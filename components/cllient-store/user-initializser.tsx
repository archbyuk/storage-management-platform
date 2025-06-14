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

export default function UserInitializer({ user }: { user: User }) {
    const setUser = useUserStore(
        (state) => state.setUser
    )

    useEffect(() => {
        setUser(user)
    }, [user, setUser])

    return null
}
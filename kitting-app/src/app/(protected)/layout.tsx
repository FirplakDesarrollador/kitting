'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/shared/api'
import { ROUTES } from '@/shared/config'
import { Sidebar } from '@/widgets/sidebar'

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push(ROUTES.LOGIN)
            } else {
                setLoading(false)
            }
        }
        checkAuth()
    }, [router, supabase.auth])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push(ROUTES.LOGIN)
        router.refresh()
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2a4a54] border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f8f7f4]">
            <Sidebar onLogout={handleLogout} />
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    )
}

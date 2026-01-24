'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/shared/api'
import { ROUTES } from '@/shared/config'

export interface LoginFormState {
    email: string
    password: string
    loading: boolean
    error: string | null
}

export function useLogin() {
    const [state, setState] = useState<LoginFormState>({
        email: '',
        password: '',
        loading: false,
        error: null,
    })

    const router = useRouter()
    const supabase = createClient()

    const setEmail = (email: string) => setState(prev => ({ ...prev, email }))
    const setPassword = (password: string) => setState(prev => ({ ...prev, password }))
    const setError = (error: string | null) => setState(prev => ({ ...prev, error }))

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: state.email,
                password: state.password,
            })

            if (error) {
                setState(prev => ({ ...prev, error: error.message, loading: false }))
            } else {
                router.push(ROUTES.DASHBOARD)
                router.refresh()
            }
        } catch {
            setState(prev => ({ ...prev, error: 'Error inesperado', loading: false }))
        }
    }

    return {
        ...state,
        setEmail,
        setPassword,
        setError,
        handleLogin,
    }
}

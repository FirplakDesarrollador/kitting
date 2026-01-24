'use client'

import Image from 'next/image'
import { useLogin } from '../model'
import { Button, Input } from '@/shared/ui'

export function LoginForm() {
    const { email, password, loading, error, setEmail, setPassword, handleLogin } = useLogin()

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
            <div className="w-full max-w-md px-8">
                {/* Logo Container */}
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-[#f5f4f0] rounded-2xl p-8 mb-2">
                        <Image
                            src="/logo.jpg"
                            alt="Kitting Logo"
                            width={150}
                            height={120}
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        showPasswordToggle
                        required
                    />

                    <Button
                        type="submit"
                        size="lg"
                        loading={loading}
                        className="w-full"
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    )
}

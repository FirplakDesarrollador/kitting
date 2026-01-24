'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/shared/api'
import { User } from '@supabase/supabase-js'

interface Stats {
    total: number
    pendientesPrekitting: number
    porVerificar: number
    finalizados: number
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null)
    const [stats, setStats] = useState<Stats>({
        total: 0,
        pendientesPrekitting: 0,
        porVerificar: 0,
        finalizados: 0
    })
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)

            // Get user
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            // Get all products to calculate stats
            // Intentamos obtener estado_verificado, pero manejamos si no existe aún
            const { data, error } = await supabase
                .from('KT_ProgramacionProducto')
                .select('*')

            if (error) {
                console.error('Error fetching stats:', error)
            } else if (data) {
                console.log('Dashboard data:', data)
                const total = data.length

                // Prekitting: estado === false
                const pendientesPrekitting = data.filter(p => p.estado === false).length

                // Kitting: estado === true AND (estado_verificado is null or false)
                const porVerificar = data.filter(p =>
                    p.estado === true &&
                    (p.estado_verificado === false || p.estado_verificado === null || p.estado_verificado === undefined)
                ).length

                // Finalizados: estado === true AND estado_verificado === true
                const finalizados = data.filter(p =>
                    p.estado === true && p.estado_verificado === true
                ).length

                setStats({
                    total,
                    pendientesPrekitting,
                    porVerificar,
                    finalizados
                })
            }

            setLoading(false)
        }

        fetchData()
    }, [supabase])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2a4a54] border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-[#2a4a54]">Indice de Producción</h1>
                    <p className="text-gray-500">Resumen general del estado de la planta</p>
                </div>
            </div>

            {/* Welcome Card */}
            <div className="bg-[#2a4a54] rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-xl font-medium opacity-90 mb-1">
                        ¡Bienvenido de nuevo!
                    </h2>
                    <p className="text-3xl font-bold">
                        {user?.email?.split('@')[0] || 'Usuario'}
                    </p>
                    <div className="mt-6 flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold uppercase tracking-wider">Sistema Operativo</span>
                    </div>
                </div>
                {/* Decorative element */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Kits */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Muebles Totales</p>
                    <div className="flex items-end justify-between">
                        <p className="text-4xl font-black text-[#2a4a54]">{stats.total}</p>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-1.242-1.008-2.25-2.25-2.25H15.75a2.25 2.25 0 01-2.013-1.244l-.256-.512a2.25 2.25 0 00-2.013-1.244H8.518a2.25 2.25 0 00-2.013 1.244l-.256.512A2.25 2.25 0 014.238 11.25H2.25a2.25 2.25 0 00-2.25 2.25z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Pendientes Prekitting */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Pendientes Pre</p>
                    <div className="flex items-end justify-between">
                        <p className="text-4xl font-black text-red-600">{stats.pendientesPrekitting}</p>
                        <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-red-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Por Verificar Kitting */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Por Verificar</p>
                    <div className="flex items-end justify-between">
                        <p className="text-4xl font-black text-blue-600">{stats.porVerificar}</p>
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-blue-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Finalizados */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Finalizados</p>
                    <div className="flex items-end justify-between">
                        <p className="text-4xl font-black text-green-600">{stats.finalizados}</p>
                        <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions or Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Desempeño de Hoy</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                            <span className="text-sm font-medium text-gray-600">Eficiencia de Prekitting</span>
                            <span className="font-bold text-[#2a4a54]">
                                {stats.total > 0 ? Math.round(((stats.total - stats.pendientesPrekitting) / stats.total) * 100) : 0}%
                            </span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                            <span className="text-sm font-medium text-gray-600">Eficiencia de Kitting</span>
                            <span className="font-bold text-blue-600">
                                {stats.total > 0 ? Math.round((stats.finalizados / stats.total) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#2a4a54]/5 rounded-2xl border border-[#2a4a54]/10 p-6 flex flex-col justify-center items-center text-center">
                    <div className="bg-[#2a4a54] p-3 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-[#2a4a54]">Reportes Avanzados</h3>
                    <p className="text-sm text-[#2a4a54]/70 mt-2 px-4">Próximamente: Gráficos detallados y exportación a Excel.</p>
                </div>
            </div>
        </div>
    )
}

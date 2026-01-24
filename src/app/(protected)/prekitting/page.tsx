'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/shared/api'

interface ProgramacionProducto {
    id: number
    sku: string
    descripcion: string
    cantidad: number
    of: string
    estado: boolean
    programacioncita: number
}

export default function PrekittingPage() {
    const [productos, setProductos] = useState<ProgramacionProducto[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchProductos = async () => {
        setLoading(true)

        // Calcular el inicio del día de hoy (00:00:00) en formato ISO
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)
        const isoTodayStart = todayStart.toISOString()

        const { data, error } = await supabase
            .from('KT_ProgramacionProducto')
            .select('*')
            // Mostrar los que NO se han terminado (estado == false)
            // O los que son de la programación de HOY (created_at >= hoy)
            .or(`estado.eq.false,created_at.gte.${isoTodayStart}`)
            // Ordenar: Pendientes primero (false < true), luego por fecha (más nuevos primero)
            .order('estado', { ascending: true })
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching productos:', error)
        } else {
            setProductos(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchProductos()
    }, [])

    const total = productos.length
    const completados = productos.filter(p => p.estado === true).length
    const pendientes = productos.filter(p => p.estado === false).length

    const formatDate = () => {
        return new Date().toLocaleDateString('es-CO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2a4a54] border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-[#2a4a54]">Programación Diaria</h1>
                    <p className="text-gray-500 capitalize">{formatDate()}</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-[#2D3748]">{total}</p>
                        <p className="text-sm text-gray-500 mt-2">Total</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-green-600">{completados}</p>
                        <p className="text-sm text-gray-500 mt-2">Completados</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-red-500">{pendientes}</p>
                        <p className="text-sm text-gray-500 mt-2">Pendientes</p>
                    </div>
                </div>
            </div>

            {/* Órdenes de Producción */}
            <div>
                <h2 className="text-lg font-semibold text-[#2D3748] mb-4">Órdenes de Producción</h2>

                <div className="space-y-3">
                    {productos.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-300 mb-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            <p className="text-gray-500">No hay órdenes de producción</p>
                            <p className="text-sm text-gray-400 mt-1">Crea una programación desde Administración</p>
                        </div>
                    ) : (
                        productos.map((producto) => (
                            <Link
                                href={`/prekitting/checklist?id=${producto.id}`}
                                key={producto.id}
                                className="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-semibold text-[#2D3748] truncate">
                                                {producto.descripcion || 'Sin descripción'}
                                            </h3>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                                                Ensamble
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            SKU: {producto.sku || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Cantidad: {producto.cantidad || 0}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            OF: {producto.of || 'N/A'}
                                        </p>
                                    </div>

                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${producto.estado ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                    >
                                        {producto.estado ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

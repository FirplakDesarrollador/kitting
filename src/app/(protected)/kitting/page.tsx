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
    estado_verificado?: boolean
    programacioncita: number
}

export default function KittingPage() {
    const [productos, setProductos] = useState<ProgramacionProducto[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchProductos = async () => {
        setLoading(true)

        // Intento de consulta con el nuevo campo de verificación
        const { data, error } = await supabase
            .from('KT_ProgramacionProducto')
            .select('*')
            .eq('estado', true)
            .order('estado_verificado', { ascending: true })
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching productos:', error)

            // Reintento sin el campo estado_verificado por si no existe aún
            const { data: fallbackData, error: fallbackError } = await supabase
                .from('KT_ProgramacionProducto')
                .select('*')
                .eq('estado', true)
                .order('created_at', { ascending: false })

            if (!fallbackError) {
                setProductos(fallbackData || [])
            } else {
                console.error('Critical fetch error:', fallbackError)
            }
        } else {
            setProductos(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchProductos()
    }, [])

    const total = productos.length
    const verificados = productos.filter(p => p.estado_verificado === true).length
    const pendientes = productos.filter(p => p.estado_verificado !== true).length

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
                    <h1 className="text-2xl font-bold text-[#2a4a54]">Verificación de Kitting</h1>
                    <p className="text-gray-500 capitalize">{formatDate()}</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-[#2D3748]">{total}</p>
                        <p className="text-sm text-gray-500 mt-2">Kits Listos</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-b-4 border-b-green-500">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-green-600">{verificados}</p>
                        <p className="text-sm text-gray-500 mt-2">Verificados</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-b-4 border-b-[#2a4a54]">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-[#2a4a54]">{pendientes}</p>
                        <p className="text-sm text-gray-500 mt-2">Por Verificar</p>
                    </div>
                </div>
            </div>

            {/* Lista de Verificación */}
            <div>
                <h2 className="text-lg font-semibold text-[#2D3748] mb-4">Órdenes de Producción Finalizadas</h2>

                <div className="space-y-3">
                    {productos.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-300 mb-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-500">No hay kits pendientes de verificación</p>
                            <p className="text-sm text-gray-400 mt-1">Los productos aparecerán aquí una vez finalizado el Prekitting</p>
                        </div>
                    ) : (
                        productos.map((producto) => (
                            <Link
                                href={`/kitting/checklist?id=${producto.id}`}
                                key={producto.id}
                                className={`block bg-white rounded-xl shadow-sm border p-4 transition-all hover:shadow-md ${producto.estado_verificado ? 'border-green-100 opacity-80' : 'border-gray-100'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className={`font-semibold truncate ${producto.estado_verificado ? 'text-gray-500' : 'text-[#2D3748]'}`}>
                                                {producto.descripcion || 'Sin descripción'}
                                            </h3>
                                            {producto.estado_verificado ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-black bg-green-500 text-white uppercase tracking-tighter">
                                                    VERIFICADO
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-black bg-[#2a4a54] text-white uppercase tracking-tighter">
                                                    VERIFICACIÓN PENDIENTE
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                                            <p className="text-xs text-gray-400">SKU: <span className="text-gray-600 font-medium">{producto.sku || 'N/A'}</span></p>
                                            <p className="text-xs text-gray-400">OF: <span className="text-gray-600 font-medium">{producto.of || 'N/A'}</span></p>
                                            <p className="text-xs text-gray-400">Cantidad: <span className="text-[#2a4a54] font-bold">{producto.cantidad || 0}</span></p>
                                        </div>
                                    </div>

                                    <div
                                        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${producto.estado_verificado ? 'bg-green-500 shadow-sm shadow-green-200' : 'bg-gray-100'
                                            }`}
                                    >
                                        {producto.estado_verificado ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-300">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
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

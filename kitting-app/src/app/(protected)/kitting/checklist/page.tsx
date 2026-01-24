'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/shared/api'
import { Button } from '@/shared/ui'

interface Componente {
    nombre_componente: string
    cantidad: number
    checked?: boolean
}

interface ProgramacionProducto {
    id: number
    sku: string
    descripcion: string
    cantidad: number
    of: string
    estado: boolean
    estado_verificado?: boolean
    componenetes: Componente[] | null
}

export default function ChecklistKittingPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const productId = searchParams.get('id')

    const [producto, setProducto] = useState<ProgramacionProducto | null>(null)
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        const fetchProducto = async () => {
            if (!productId) {
                router.push('/kitting')
                return
            }

            const { data, error } = await supabase
                .from('KT_ProgramacionProducto')
                .select('*')
                .eq('id', parseInt(productId))
                .single()

            if (error || !data) {
                console.error('Error fetching producto:', error)
                router.push('/kitting')
                return
            }

            setProducto(data)
            setLoading(false)
        }

        fetchProducto()
    }, [productId, router, supabase])

    const handleCheckChange = (compIndex: number, unitIndex: number, checked: boolean) => {
        const key = `${compIndex}-${unitIndex}`
        setCheckedItems(prev => ({ ...prev, [key]: checked }))
    }

    // Usar los componentes del producto o los de ejemplo
    const componentes: Componente[] = producto?.componenetes || [
        { nombre_componente: 'Tornillo M6x20', cantidad: 8 },
        { nombre_componente: 'Bisagra oculta', cantidad: 4 },
        { nombre_componente: 'Riel cajón 45cm', cantidad: 2 },
        { nombre_componente: 'Chazo expansivo', cantidad: 4 },
        { nombre_componente: 'Tirador cromado', cantidad: 2 },
    ]

    const totalUnities = producto?.cantidad || 0
    const expectedChecks = componentes.length * totalUnities
    const currentChecks = Object.values(checkedItems).filter(Boolean).length
    const allChecked = expectedChecks > 0 && currentChecks === expectedChecks

    const handleVerificar = async () => {
        if (!producto) return

        setSaving(true)

        const { error } = await supabase
            .from('KT_ProgramacionProducto')
            .update({ estado_verificado: true })
            .eq('id', producto.id)

        if (error) {
            console.error('Error al verificar:', error)
            alert('Error al guardar la verificación. Asegúrate de que la columna "estado_verificado" existe.')
        } else {
            alert('Mueble verificado exitosamente')
            router.push('/kitting')
        }

        setSaving(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2a4a54] border-t-transparent"></div>
            </div>
        )
    }

    if (!producto) {
        return null
    }

    return (
        <div className="min-h-screen bg-[#f8f7f4]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Header & Global Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Link
                        href="/kitting"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#2a4a54] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        <span>Volver a Kitting</span>
                    </Link>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            const newChecked: Record<string, boolean> = { ...checkedItems }
                            componentes.forEach((_, compIdx) => {
                                for (let i = 0; i < totalUnities; i++) {
                                    newChecked[`${compIdx}-${i}`] = true
                                }
                            })
                            setCheckedItems(newChecked)
                        }}
                        className="text-xs font-bold uppercase tracking-wider bg-[#2a4a54]/10 text-[#2a4a54] hover:bg-[#2a4a54]/20 border-none px-4"
                    >
                        Verificar Todo Automáticamente
                    </Button>
                </div>

                {/* Banner de Verificación */}
                <div className="bg-[#2a4a54] rounded-xl p-6 text-white shadow-lg flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight">Módulo de Verificación</h1>
                        <p className="text-teal-100 text-sm opacity-90 font-medium">Confirma que el Prekitting se realizó correctamente.</p>
                    </div>
                </div>

                {/* Product Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {producto.descripcion || 'Producto sin nombre'}
                        </h2>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                            LISTO PARA REVISAR
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">SKU</p>
                            <p className="font-mono text-gray-800 bg-gray-50 px-2 py-1 rounded inline-block">{producto.sku || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Cantidad Total</p>
                            <p className="font-black text-[#2a4a54] text-3xl">{producto.cantidad || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Components List */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-[#2a4a54] rounded-full"></span>
                        Revisión de Componentes
                    </h3>

                    <div className="space-y-4">
                        {componentes.map((componente, compIndex) => {
                            const totalNecesario = (producto.cantidad || 0) * componente.cantidad

                            return (
                                <div
                                    key={compIndex}
                                    className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:border-[#2a4a54]/30 transition-all"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-bold text-lg text-gray-800">
                                                    {componente.nombre_componente}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1 font-medium bg-gray-50 inline-block px-2 py-0.5 rounded">
                                                    Verificar {totalNecesario} piezas finales
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    const next = { ...checkedItems }
                                                    for (let i = 0; i < totalUnities; i++) {
                                                        next[`${compIndex}-${i}`] = true
                                                    }
                                                    setCheckedItems(next)
                                                }}
                                                className="text-xs font-black text-[#2a4a54] hover:bg-[#2a4a54]/5 px-3 py-1.5 rounded-lg border border-[#2a4a54]/20 transition-all uppercase tracking-tight"
                                            >
                                                Verificar Todas
                                            </button>
                                        </div>

                                        <div className="border-t border-gray-50 pt-4">
                                            <p className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-[0.2em]">Chequeo por Unidad:</p>
                                            <div className="flex flex-wrap gap-3">
                                                {Array.from({ length: totalUnities }).map((_, unitIndex) => {
                                                    const key = `${compIndex}-${unitIndex}`
                                                    const isChecked = checkedItems[key] || false
                                                    return (
                                                        <label key={unitIndex} className="flex items-center gap-2 cursor-pointer group">
                                                            <div className="relative">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={(e) => handleCheckChange(compIndex, unitIndex, e.target.checked)}
                                                                    className="sr-only peer"
                                                                />
                                                                <div className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all duration-200
                                                                    ${isChecked
                                                                        ? 'bg-[#2a4a54] border-[#2a4a54] shadow-md shadow-[#2a4a54]/20'
                                                                        : 'bg-white border-gray-200 group-hover:border-[#2a4a54] group-hover:scale-110'
                                                                    }`}
                                                                >
                                                                    {isChecked ? (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="w-6 h-6 text-white">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                        </svg>
                                                                    ) : (
                                                                        <span className="text-sm text-gray-400 font-black">{unitIndex + 1}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Progress */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Progreso de Verificación</span>
                        <div className="text-right">
                            <span className="text-2xl font-black text-[#2a4a54]">
                                {Math.round((currentChecks / expectedChecks) * 100)}%
                            </span>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{currentChecks} de {expectedChecks} completados</p>
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden p-1">
                        <div
                            className="bg-[#2a4a54] h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                            style={{
                                width: `${(currentChecks / expectedChecks) * 100}%`
                            }}
                        />
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                    <Button
                        onClick={handleVerificar}
                        loading={saving}
                        disabled={!allChecked}
                        className={`w-full justify-center h-16 text-lg font-black uppercase tracking-widest transition-all duration-300 ${allChecked
                            ? 'bg-green-600 hover:bg-green-700 shadow-xl shadow-green-600/30 scale-[1.02]'
                            : 'bg-gray-200 cursor-not-allowed text-gray-400 border border-gray-100'
                            }`}
                        size="lg"
                    >
                        {allChecked ? 'Finalizar Verificación' : 'Revisión Incompleta'}
                    </Button>

                    {!allChecked && (
                        <p className="text-center text-xs text-gray-400 mt-6 font-medium italic">
                            * Debes revisar todos los componentes para todas las unidades antes de confirmar el kitting.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

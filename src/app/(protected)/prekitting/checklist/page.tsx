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
    componenetes: Componente[] | null
}

export default function ChecklistPrekittingPage() {
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
                router.push('/prekitting')
                return
            }

            const { data: productoData, error: productoError } = await supabase
                .from('KT_ProgramacionProducto')
                .select('*')
                .eq('id', parseInt(productId))
                .single()

            if (productoError || !productoData) {
                console.error('Error fetching producto:', productoError)
                router.push('/prekitting')
                return
            }

            // Fetch componentes from query_kitting view based on SKU
            if (productoData.sku) {
                const { data: kittingData, error: kittingError } = await supabase
                    .from('query_kitting')
                    .select('Componentes')
                    .eq('SKU', productoData.sku)
                    .single()

                if (!kittingError && kittingData) {
                    productoData.componenetes = kittingData.Componentes as Componente[]
                } else {
                    console.error('Error fetching kitting components:', kittingError)
                }
            }

            setProducto(productoData)
            setLoading(false)
        }

        fetchProducto()
    }, [productId, router, supabase])


    const handleCheckChange = (compIndex: number, unitIndex: number, checked: boolean) => {
        const key = `${compIndex}-${unitIndex}`
        setCheckedItems(prev => ({ ...prev, [key]: checked }))
    }

    const componentes: Componente[] = producto?.componenetes || []


    const totalUnities = producto?.cantidad || 0
    const expectedChecks = componentes.length * totalUnities
    const currentChecks = Object.values(checkedItems).filter(Boolean).length
    const allChecked = expectedChecks > 0 && currentChecks === expectedChecks

    const handleTerminar = async () => {
        if (!producto) return

        setSaving(true)

        const { error } = await supabase
            .from('KT_ProgramacionProducto')
            .update({ estado: true })
            .eq('id', producto.id)

        if (error) {
            console.error('Error updating producto:', error)
            alert('Error al actualizar el estado')
        } else {
            alert('Mueble terminado exitosamente')
            router.push('/prekitting')
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
                        href="/prekitting"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#2a4a54] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        <span>Volver a Prekitting</span>
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
                        Marcar Todo el Mueble
                    </Button>
                </div>

                {/* Product Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {producto.descripcion || 'Producto sin nombre'}
                    </h2>

                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500">SKU</p>
                            <p className="font-semibold text-gray-800">{producto.sku || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Cantidad a preparar</p>
                            <p className="font-semibold text-[#2a4a54] text-xl">{producto.cantidad || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Components List */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Componentes del Kit</h3>

                    <div className="space-y-3">
                        {componentes.map((componente, compIndex) => {
                            const totalNecesario = (producto.cantidad || 0) * componente.cantidad

                            return (
                                <div
                                    key={compIndex}
                                    className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800 transition-colors">
                                                    {componente.nombre_componente}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {componente.cantidad} piezas por mueble
                                                </p>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="text-sm text-gray-500">Total necesario:</span>
                                                    <span className="font-bold text-[#2a4a54] text-lg">
                                                        {totalNecesario}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    const next = { ...checkedItems }
                                                    for (let i = 0; i < totalUnities; i++) {
                                                        next[`${compIndex}-${i}`] = true
                                                    }
                                                    setCheckedItems(next)
                                                }}
                                                className="text-xs font-bold text-[#2a4a54] hover:bg-[#2a4a54]/5 px-2 py-1 rounded transition-colors uppercase tracking-tight"
                                            >
                                                Marcar Todo
                                            </button>
                                        </div>

                                        <div className="border-t border-gray-50 pt-3">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Estado por unidad:</p>
                                            <div className="flex flex-wrap gap-2">
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
                                                                <div className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center transition-all
                                                                    ${isChecked
                                                                        ? 'bg-[#2a4a54] border-[#2a4a54] shadow-sm shadow-[#2a4a54]/20'
                                                                        : 'bg-white border-gray-200 group-hover:border-[#2a4a54]'
                                                                    }`}
                                                                >
                                                                    {isChecked ? (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-white">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                        </svg>
                                                                    ) : (
                                                                        <span className="text-xs text-gray-400 font-bold">{unitIndex + 1}</span>
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Progreso de Kitting</span>
                        <span className="text-sm font-medium text-[#2a4a54]">
                            {currentChecks} / {expectedChecks} ({Math.round((currentChecks / expectedChecks) * 100)}%)
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-[#2a4a54] h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                                width: `${(currentChecks / expectedChecks) * 100}%`
                            }}
                        />
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                    <Button
                        onClick={handleTerminar}
                        loading={saving}
                        disabled={!allChecked}
                        className={`w-full justify-center h-14 text-base font-bold transition-all ${allChecked
                            ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20'
                            : 'bg-gray-300 cursor-not-allowed text-gray-500'
                            }`}
                        size="lg"
                    >
                        Terminar Mueble
                    </Button>

                    {!allChecked && (
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Debes marcar todos los componentes para todas las unidades antes de finalizar.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

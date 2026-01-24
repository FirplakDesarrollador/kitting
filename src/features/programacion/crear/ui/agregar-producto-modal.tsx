'use client'

import { useState } from 'react'
import { Button, Input } from '@/shared/ui'
import { Producto } from '@/entities/programacion'

interface AgregarProductoModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (producto: Producto) => void
}

export function AgregarProductoModal({ isOpen, onClose, onAdd }: AgregarProductoModalProps) {
    const [formData, setFormData] = useState({
        ordenFabricacion: '',
        sku: '',
        descripcion: '',
        cantidad: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors: Record<string, string> = {}

        if (!formData.ordenFabricacion.trim()) {
            newErrors.ordenFabricacion = 'La orden de fabricación es requerida'
        }
        if (!formData.sku.trim()) {
            newErrors.sku = 'El SKU es requerido'
        }
        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida'
        }
        if (!formData.cantidad || parseInt(formData.cantidad) <= 0) {
            newErrors.cantidad = 'La cantidad debe ser mayor a 0'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        onAdd({
            ordenFabricacion: formData.ordenFabricacion.trim(),
            sku: formData.sku.trim(),
            descripcion: formData.descripcion.trim(),
            cantidad: parseInt(formData.cantidad),
        })

        // Reset form
        setFormData({ ordenFabricacion: '', sku: '', descripcion: '', cantidad: '' })
        setErrors({})
        onClose()
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[#2a4a54]">Agregar Producto</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            placeholder="Orden de Fabricación"
                            value={formData.ordenFabricacion}
                            onChange={(e) => handleChange('ordenFabricacion', e.target.value)}
                            error={errors.ordenFabricacion}
                        />
                    </div>

                    <div>
                        <Input
                            placeholder="SKU"
                            value={formData.sku}
                            onChange={(e) => handleChange('sku', e.target.value)}
                            error={errors.sku}
                        />
                    </div>

                    <div>
                        <Input
                            placeholder="Descripción del Producto"
                            value={formData.descripcion}
                            onChange={(e) => handleChange('descripcion', e.target.value)}
                            error={errors.descripcion}
                        />
                    </div>

                    <div>
                        <Input
                            type="number"
                            placeholder="Cantidad"
                            value={formData.cantidad}
                            onChange={(e) => handleChange('cantidad', e.target.value)}
                            error={errors.cantidad}
                            min="1"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                        >
                            Agregar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

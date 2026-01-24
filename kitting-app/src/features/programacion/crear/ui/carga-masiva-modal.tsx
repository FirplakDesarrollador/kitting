'use client'

import { useState, useRef } from 'react'
import { Button } from '@/shared/ui'
import { Producto } from '@/entities/programacion'

interface CargaMasivaModalProps {
    isOpen: boolean
    onClose: () => void
    onUpload: (productos: Producto[]) => void
}

export function CargaMasivaModal({ isOpen, onClose, onUpload }: CargaMasivaModalProps) {
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [preview, setPreview] = useState<Producto[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    if (!isOpen) return null

    const parseCSV = (text: string): Producto[] => {
        const lines = text.trim().split('\n')
        if (lines.length < 2) {
            throw new Error('El archivo debe tener al menos una fila de datos además del encabezado')
        }

        const productos: Producto[] = []

        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))

            if (values.length < 4) {
                throw new Error(`Fila ${i + 1}: faltan columnas. Se esperan: OrdenFabricacion, SKU, Descripcion, Cantidad`)
            }

            const cantidad = parseInt(values[3])
            if (isNaN(cantidad) || cantidad <= 0) {
                throw new Error(`Fila ${i + 1}: la cantidad debe ser un número mayor a 0`)
            }

            productos.push({
                ordenFabricacion: values[0],
                sku: values[1],
                descripcion: values[2],
                cantidad: cantidad,
            })
        }

        return productos
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        setFile(selectedFile)
        setError(null)
        setPreview([])

        try {
            const text = await selectedFile.text()
            const productos = parseCSV(text)
            setPreview(productos)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al leer el archivo')
            setPreview([])
        }
    }

    const handleUpload = () => {
        if (preview.length > 0) {
            onUpload(preview)
            handleClose()
        }
    }

    const handleClose = () => {
        setFile(null)
        setError(null)
        setPreview([])
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[#2a4a54]">Carga Masiva CSV</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-medium text-blue-800 mb-2">Formato del archivo CSV:</h3>
                        <p className="text-sm text-blue-700">
                            El archivo debe tener las siguientes columnas en orden:<br />
                            <code className="bg-blue-100 px-1 rounded">OrdenFabricacion, SKU, Descripcion, Cantidad</code>
                        </p>
                    </div>

                    {/* File Input */}
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#2a4a54] transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <p className="text-gray-600">
                            {file ? file.name : 'Haz clic para seleccionar un archivo CSV'}
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Preview */}
                    {preview.length > 0 && (
                        <div>
                            <h3 className="font-medium text-gray-800 mb-2">Vista previa ({preview.length} productos):</h3>
                            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2 text-left">OF</th>
                                            <th className="px-3 py-2 text-left">SKU</th>
                                            <th className="px-3 py-2 text-left">Descripción</th>
                                            <th className="px-3 py-2 text-right">Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {preview.slice(0, 10).map((p, i) => (
                                            <tr key={i}>
                                                <td className="px-3 py-2">{p.ordenFabricacion}</td>
                                                <td className="px-3 py-2">{p.sku}</td>
                                                <td className="px-3 py-2 truncate max-w-[200px]">{p.descripcion}</td>
                                                <td className="px-3 py-2 text-right">{p.cantidad}</td>
                                            </tr>
                                        ))}
                                        {preview.length > 10 && (
                                            <tr>
                                                <td colSpan={4} className="px-3 py-2 text-center text-gray-500">
                                                    ... y {preview.length - 10} más
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={preview.length === 0}
                            className="flex-1"
                        >
                            Cargar {preview.length > 0 && `(${preview.length})`}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

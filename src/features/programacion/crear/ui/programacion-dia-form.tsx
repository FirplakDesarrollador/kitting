'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/shared/ui'
import { useProgramacionDia } from '../model'
import { AgregarProductoModal } from './agregar-producto-modal'
import { CargaMasivaModal } from './carga-masiva-modal'
import { useRouter } from 'next/navigation'

export function ProgramacionDiaForm() {
    const router = useRouter()
    const [showAddModal, setShowAddModal] = useState(false)
    const [showCsvModal, setShowCsvModal] = useState(false)
    const [showConfirmCancel, setShowConfirmCancel] = useState(false)

    const {
        productos,
        loading,
        error,
        fechaProgramacion,
        addProducto,
        removeProducto,
        addProductosBulk,
        crearProgramacion,
        downloadCSVTemplate,
        setError,
        totalProductos,
    } = useProgramacionDia()

    const handleCrear = async () => {
        const success = await crearProgramacion()
        if (success) {
            alert('La programación del día ha sido guardada satisfactoriamente')
            router.push('/administracion')
        }
    }

    const handleCancel = () => {
        if (productos.length > 0) {
            setShowConfirmCancel(true)
        } else {
            router.push('/administracion')
        }
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }

    return (
        <div className="min-h-screen bg-[#f8f7f4]">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        <Link
                            href="/administracion"
                            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-semibold text-[#2a4a54]">Programación Día</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Nueva Programación Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-[#2a4a54] mb-6">Nueva Programación</h2>

                    {/* Fecha */}
                    <div className="bg-[#2a4a54]/5 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    FECHA DE PROGRAMACIÓN
                                </p>
                                <p className="text-lg font-semibold text-[#2a4a54] mt-1">
                                    {formatDate(fechaProgramacion)}
                                </p>
                            </div>
                            <div className="bg-[#2a4a54]/10 p-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#2a4a54]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <Button onClick={() => setShowAddModal(true)} className="justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Agregar Producto
                        </Button>
                        <Button variant="outline" onClick={() => setShowCsvModal(true)} className="justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            Carga Masiva
                        </Button>
                    </div>

                    <Button variant="ghost" onClick={downloadCSVTemplate} className="w-full justify-center border border-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Descargar Plantilla CSV
                    </Button>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Productos Agregados</h3>
                        <span className="text-sm text-gray-500">{totalProductos} productos</span>
                    </div>

                    {/* Table Header */}
                    <div className="bg-[#2a4a54]/5 px-4 py-3 hidden md:grid md:grid-cols-5 gap-4">
                        <span className="text-xs font-semibold text-gray-600 uppercase">Orden de Fabricación</span>
                        <span className="text-xs font-semibold text-gray-600 uppercase">SKU</span>
                        <span className="text-xs font-semibold text-gray-600 uppercase">Descripción</span>
                        <span className="text-xs font-semibold text-gray-600 uppercase text-center">Cantidad</span>
                        <span className="text-xs font-semibold text-gray-600 uppercase text-center">Acciones</span>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-100">
                        {productos.length === 0 ? (
                            <div className="px-4 py-12 text-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-300 mb-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                                <p>No hay productos agregados</p>
                                <p className="text-sm mt-1">Usa los botones de arriba para agregar productos</p>
                            </div>
                        ) : (
                            productos.map((producto) => (
                                <div key={producto.id} className="px-4 py-3 md:grid md:grid-cols-5 gap-4 items-center hover:bg-gray-50">
                                    {/* Mobile Layout */}
                                    <div className="md:hidden space-y-2 mb-3">
                                        <div className="flex justify-between">
                                            <span className="text-xs text-gray-500">OF:</span>
                                            <span className="font-medium">{producto.ordenFabricacion}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs text-gray-500">SKU:</span>
                                            <span>{producto.sku}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs text-gray-500">Descripción:</span>
                                            <span className="truncate max-w-[200px]">{producto.descripcion}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-xs text-gray-500">Cantidad: </span>
                                                <span className="font-semibold">{producto.cantidad}</span>
                                            </div>
                                            <button
                                                onClick={() => removeProducto(producto.id!)}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Desktop Layout */}
                                    <span className="hidden md:block text-sm">{producto.ordenFabricacion}</span>
                                    <span className="hidden md:block text-sm">{producto.sku}</span>
                                    <span className="hidden md:block text-sm truncate">{producto.descripcion}</span>
                                    <span className="hidden md:block text-sm text-center font-medium">{producto.cantidad}</span>
                                    <div className="hidden md:flex justify-center">
                                        <button
                                            onClick={() => removeProducto(producto.id!)}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                        <button onClick={() => setError(null)} className="float-right">×</button>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button
                            onClick={handleCrear}
                            loading={loading}
                            disabled={productos.length === 0}
                            className="justify-center bg-green-600 hover:bg-green-700"
                            size="lg"
                        >
                            Crear Programación Día
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="justify-center text-red-600 border-red-300 hover:bg-red-50"
                            size="lg"
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AgregarProductoModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={addProducto}
            />
            <CargaMasivaModal
                isOpen={showCsvModal}
                onClose={() => setShowCsvModal(false)}
                onUpload={addProductosBulk}
            />

            {/* Confirm Cancel Dialog */}
            {showConfirmCancel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowConfirmCancel(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">¡Alerta!</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Seguro que quieres cancelar la programación? Se borrará todo lo que has registrado.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowConfirmCancel(false)}
                                className="flex-1"
                            >
                                Volver
                            </Button>
                            <Button
                                onClick={() => router.push('/administracion')}
                                className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                                Confirmar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

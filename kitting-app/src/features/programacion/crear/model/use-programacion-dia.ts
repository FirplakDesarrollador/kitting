'use client'

import { useState, useCallback } from 'react'
import { Producto, ProgramacionFormState } from '@/entities/programacion'
import { createClient } from '@/shared/api'

export function useProgramacionDia() {
    const [state, setState] = useState<ProgramacionFormState>({
        productos: [],
        loading: false,
        error: null,
        fechaProgramacion: new Date(),
    })

    const supabase = createClient()

    const addProducto = useCallback((producto: Producto) => {
        setState(prev => ({
            ...prev,
            productos: [...prev.productos, { ...producto, id: crypto.randomUUID() }],
        }))
    }, [])

    const removeProducto = useCallback((id: string) => {
        setState(prev => ({
            ...prev,
            productos: prev.productos.filter(p => p.id !== id),
        }))
    }, [])

    const addProductosBulk = useCallback((productos: Producto[]) => {
        setState(prev => ({
            ...prev,
            productos: [
                ...prev.productos,
                ...productos.map(p => ({ ...p, id: crypto.randomUUID() })),
            ],
        }))
    }, [])

    const clearProductos = useCallback(() => {
        setState(prev => ({ ...prev, productos: [] }))
    }, [])

    const setFechaProgramacion = useCallback((fecha: Date) => {
        setState(prev => ({ ...prev, fechaProgramacion: fecha }))
    }, [])

    const setError = useCallback((error: string | null) => {
        setState(prev => ({ ...prev, error }))
    }, [])

    const crearProgramacion = useCallback(async () => {
        if (state.productos.length === 0) {
            setState(prev => ({ ...prev, error: 'Debe agregar al menos un producto' }))
            return false
        }

        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            // Insert programacion dia
            const { data: programacion, error: progError } = await supabase
                .from('KT_ProgramacionDia')
                .insert({
                    estado: 'agendado',
                    fechadeProgramacion: state.fechaProgramacion.toISOString(),
                    cantidadpiezas: state.productos.length,
                    cantidaddepiezasrealizadas: 0,
                    productos: state.productos.map(p => ({
                        Ordendefabricacion: p.ordenFabricacion,
                        SKU: p.sku,
                        descripcion: p.descripcion,
                        cantidad: p.cantidad,
                    })),
                })
                .select()
                .single()

            if (progError) throw progError

            // Insert each producto
            for (const producto of state.productos) {
                const { error: prodError } = await supabase
                    .from('KT_ProgramacionProducto')
                    .insert({
                        sku: producto.sku,
                        descripcion: producto.descripcion,
                        cantidad: producto.cantidad,
                        of: producto.ordenFabricacion,
                        programacioncita: programacion.id,
                        estado: false,
                    })

                if (prodError) throw prodError
            }

            setState(prev => ({ ...prev, loading: false, productos: [] }))
            return true
        } catch (error) {
            console.error('Error creating programacion:', error)
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Error al crear programación',
            }))
            return false
        }
    }, [state.productos, state.fechaProgramacion, supabase])

    const downloadCSVTemplate = useCallback(() => {
        const headers = ['OrdenFabricacion', 'SKU', 'Descripcion', 'Cantidad']
        const exampleRow = ['OF-001', 'SKU-12345', 'Producto ejemplo', '10']

        const csvContent = [
            headers.join(','),
            exampleRow.join(','),
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.setAttribute('href', url)
        link.setAttribute('download', 'plantilla_programacion_kitting.csv')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }, [])

    return {
        ...state,
        addProducto,
        removeProducto,
        addProductosBulk,
        clearProductos,
        setFechaProgramacion,
        setError,
        crearProgramacion,
        downloadCSVTemplate,
        totalProductos: state.productos.length,
    }
}

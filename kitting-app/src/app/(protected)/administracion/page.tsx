import Link from 'next/link'

export default function AdministracionPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#2a4a54]">Administración</h1>

            {/* Main Action Button */}
            <Link
                href="/administracion/programacion-dia"
                className="block bg-[#2a4a54] hover:bg-[#1e3940] text-white rounded-xl p-6 transition-all hover:shadow-lg"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-4 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Crear Programación Kitting Día</h2>
                        <p className="text-white/70 mt-1">Programa los productos para kitting del día</p>
                    </div>
                </div>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Usuarios Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#2a4a54]/10 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#2a4a54]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Usuarios</h3>
                            <p className="text-sm text-gray-500">Gestionar usuarios del sistema</p>
                        </div>
                    </div>
                </div>

                {/* Roles Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Roles</h3>
                            <p className="text-sm text-gray-500">Configurar roles y permisos</p>
                        </div>
                    </div>
                </div>

                {/* Configuración Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Configuración</h3>
                            <p className="text-sm text-gray-500">Ajustes del sistema</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

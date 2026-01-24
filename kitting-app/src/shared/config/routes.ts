export const ROUTES = {
    // Public routes
    LOGIN: '/login',

    // Protected routes
    DASHBOARD: '/dashboard',
    ADMINISTRACION: '/administracion',
    PREKITTING: '/prekitting',
    KITTING: '/kitting',

    // API routes
    API: {
        HEALTH: '/api/health',
    },
} as const

export type Route = typeof ROUTES

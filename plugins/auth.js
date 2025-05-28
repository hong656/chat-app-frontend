export default defineNuxtPlugin((nuxtApp) => {
    addRouteMiddleware('auth', (to) => {
        // Only run on client-side
        if (process.client) {
            const token = localStorage.getItem('token');

            if (!token && to.path !== '/auth/login' && to.path !== '/auth/register') {
                return navigateTo('/auth/login');
            }

            if (token && (to.path === '/auth/login' || to.path === '/auth/register')) {
                return navigateTo('/');
            }
        }
    }, { global: true });
});
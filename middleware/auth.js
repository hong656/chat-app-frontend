// export default function ({ store, redirect, route }) {
//     const token = localStorage.getItem('token')

//     if (!token && route.path !== '/auth/login') {
//         return redirect('/auth/login')
//     }

//     if (token && route.path === '/auth/login') {
//         return redirect('/')
//     }
// }
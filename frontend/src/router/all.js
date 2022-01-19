const routes = [
    {
        path: '/',
        name: 'root',
        component: () => import('@component/Register.vue')
    },
    {
        path: '/add_quetions',
        name: 'add_quetions',
        component: () => import('@component/AddQuetions.vue')
    },
    {
        path: '/history',
        name: 'view_history',
        component: () => import('@component/History.vue')
    }
]

export default routes
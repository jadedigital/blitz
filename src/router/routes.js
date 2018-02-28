
export default [
  { path: '/',
    component: () => import('layouts/home'),
    redirect: {name: 'team'},
    name: 'user',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'user/team',
        name: 'team',
        component: () => import('pages/team'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/login')
  },
  // Always leave this last one
  {
    path: '*',
    component: () => import('pages/404')
  } // Not found
]

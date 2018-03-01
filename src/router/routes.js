
export default [
  { path: '/',
    component: () => import('layouts/root'),
    redirect: {name: 'team'},
    children: [
      { path: 'user',
        component: () => import('layouts/home'),
        redirect: {name: 'team'},
        name: 'user',
        meta: { requiresAuth: true },
        children: [
          {
            path: 'team',
            name: 'team',
            component: () => import('pages/team'),
            meta: { requiresAuth: true }
          },
          {
            path: 'league',
            name: 'league',
            component: () => import('pages/league'),
            meta: { requiresAuth: true }
          },
          {
            path: 'matchup',
            name: 'matchup',
            component: () => import('pages/matchup'),
            meta: { requiresAuth: true }
          }
        ]
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('pages/login')
      }
    ]
  },
  // Always leave this last one
  {
    path: '*',
    component: () => import('pages/404')
  } // Not found
]

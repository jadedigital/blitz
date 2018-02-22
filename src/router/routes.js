
export default [
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
        component: () => import('pages/league'),
        name: 'league',
        meta: { requiresAuth: true }
      },
      {
        path: 'draft',
        component: () => import('pages/draft'),
        meta: { requiresAuth: true }
      },
      {
        path: 'matchup',
        component: () => import('pages/matchup'),
        meta: { requiresAuth: true }
      },
      {
        path: 'players',
        component: () => import('pages/players'),
        name: 'players',
        meta: { requiresAuth: true }
      },
      {
        path: 'chat',
        component: () => import('pages/chat'),
        name: 'chat',
        meta: { requiresAuth: true }
      }
    ]
  },
  { 
    path: '/login', 
    name: 'login',
    component: () => import('pages/login') 
  },
  {
    path: 'team/:id',
    component: () => import('pages/teamOther'),
    name: 'teamOther',
    meta: { requiresAuth: true }
  },
  {
    path: 'player/:id',
    component: () => import('pages/player'),
    name: 'player',
    meta: { requiresAuth: true }
  },
  {
    path: 'thread/:id',
    component: () => import('pages/thread'),
    name: 'thread',
    meta: { requiresAuth: true }
  },
  {
    path: 'message',
    component: () => import('pages/message'),
    name: 'message',
    meta: { requiresAuth: true }
  },
  {
    path: 'newmessage',
    component: () => import('pages/newmessage'),
    name: 'newmessage',
    meta: { requiresAuth: true }
  },
  {
    path: 'matchup',
    component: () => import('pages/matchupOther'),
    name: 'matchupOther',
    meta: { requiresAuth: true }
  },
  {
    path: 'settings',
    component: () => import('pages/settings'),
    name: 'settings',
    meta: { requiresAuth: true }
  },
  {
    path: 'settings/general',
    name: 'settingsGeneral',
    component: () => import('pages/settingsGeneral'),
    meta: { requiresAuth: true }
  },
  // Always leave this last one
  { 
    path: '*',
    component: () => import('pages/Error404')
  } // Not found
]

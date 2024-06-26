// 👉 Redirects
export const redirects = [
  // ℹ️ We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: '/',
    name: 'index',
    redirect: to => {
      return { name: 'home' }
    },
  },
  {
    path: '/pages/user-profile',
    name: 'pages-user-profile',
    redirect: () => ({
      name: 'pages-user-profile-tab',
      params: { tab: 'profile' },
    }),
  },
  {
    path: '/pages/account-settings',
    name: 'account-settings',
    redirect: () => ({
      name: 'pages-account-settings',
      params: { tab: 'account' },
    }),
  },
]

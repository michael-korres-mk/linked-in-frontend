import { useSessionStore } from '../stores/session'

export const setupGuards = router => {
  router.beforeEach(to => {
    if (to.meta.public) {
      return
    }

    const store = useSessionStore()
    const isLoggedIn = store.isAuthenticated

    if (to.meta.unauthenticatedOnly) {
      if (isLoggedIn) {
        return '/home'
      }

      return
    }

    const authority = to.meta.authority
    if (
      !(
        isLoggedIn
        // && authority &&
        // store.userRights.includes(`${authority}_view`)
      )
    ) {
      return isLoggedIn
        ? { name: 'not-authorized' }
        : {
          name: 'login-wall',
          query: {
            ...to.query,
            to: to.fullPath !== '/' ? to.path : undefined,
          },
        }
    }
  })
}

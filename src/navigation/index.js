import { useSessionStore } from '../stores/session'

let menu = []
const store = useSessionStore()

const isLoggedIn = store.isAuthenticated
if (isLoggedIn) {
  menu = (store.isAdmin)?
      [
          {
              title: 'Χρήστες',
              to: 'users',
              icon: 'fas fa-users',
              authority: 'users',
          },
      ]
      :
      [
          {
              title: 'Αρχική',
              icon: 'fas fa-house',
              meta: {public: true},
              to: 'home',
              // authority: 'announcements',
          },
          {
              title: 'Δίκτυο',
              to: {
                  name: `network-id`,
                  params: { id: 0 },
              },
              icon: 'fas fa-user-group',
              // authority: 'users',
          },
          {
              title: 'Αγγελίες',
              to: 'jobs',
              icon: 'fas fa-briefcase',
              // authority: 'users',
          },
          {
              title: 'Συζητήσεις',
              to: 'chats',
              icon: 'fas fa-message',
              // authority: 'users',
          },
          {
              title: 'Ειδοποιήσεις',
              to: 'notifications',
              icon: 'fas fa-bell',
              // authority: 'users',
          },
          {
              title: 'Ρυθμίσεις',
              to: {
                  name:'profile-settings',
                  query:{ view: 1 }
              },
              icon: 'fas fa-gear',
              // authority: 'settings',
          },
  ]
    // .filter(entry => store.userRights.includes(`${entry.authority}_view` || `${entry.authority}_edit`))
}
export default menu

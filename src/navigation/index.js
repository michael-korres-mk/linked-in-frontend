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
          },
          {
              title: 'Δίκτυο',
              to: {
                  name: `network-id`,
                  params: { id: 0 },
              },
              icon: 'fas fa-user-group',
          },
          {
              title: 'Αγγελίες',
              to: 'jobs',
              icon: 'fas fa-briefcase',
          },
          {
              title: 'Συζητήσεις',
              to: {
                  name: `chats-id`,
                  params: { id: 0 },
              },
              icon: 'fas fa-message',
          },
          {
              title: 'Ειδοποιήσεις',
              to: 'notifications',
              icon: 'fas fa-bell',
          },
          {
              title: 'Προσωπικά Στοιχεία',
              to: {
                  name:'personal-info',
                  query:{ view: 1 }
              },
              icon: 'fas fa-address-card',
          },
          {
              title: 'Ρυθμίσεις',
              to: {
                  name:'profile-settings',
                  query:{ view: 1 }
              },
              icon: 'fas fa-gear',
          },
  ]
    // .filter(entry => store.userRights.includes(`${entry.authority}_view` || `${entry.authority}_edit`))
}
export default menu

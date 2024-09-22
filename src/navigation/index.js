import { useSessionStore } from '../stores/session'

let menu = []
const store = useSessionStore()

const isLoggedIn = store.isAuthenticated
if (isLoggedIn) {
  menu = [
          {
              title: 'Χρήστες',
              to: {
                  name:'users',
                  query:{ view: 1 }
              },
              icon: 'fas fa-users',
              userRole: 'ADMIN',
          },
          {
              title: 'Αρχική',
              icon: 'fas fa-house',
              meta: {public: true},
              to: 'home',
              userRole: 'PROFESSIONAL',
          },
          {
              title: 'Δίκτυο',
              to: {
                  name: `network-id`,
                  params: { id: 0 },
              },
              icon: 'fas fa-user-group',
              userRole: 'PROFESSIONAL',
          },
          {
              title: 'Αγγελίες',
              to: 'jobs',
              icon: 'fas fa-briefcase',
              userRole: 'PROFESSIONAL',
          },
          {
              title: 'Συζητήσεις',
              to: {
                  name: `chats-id`,
                  params: { id: 0 },
              },
              icon: 'fas fa-message',
              userRole: 'PROFESSIONAL',
          },
          {
              title: 'Ειδοποιήσεις',
              to: 'notifications',
              icon: 'fas fa-bell',
              userRole: 'PROFESSIONAL',
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
    .filter(entry => (entry.userRole == undefined) || store.userData.userRole == entry.userRole)
}
export default menu

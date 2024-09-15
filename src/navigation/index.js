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
              to: 'network',
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
          // {
          //   title: 'Ρόλοι',
          //   to: 'roles',
          //   icon: { icon: 'tabler-schema' },
          //   // authority: 'users',
          // },
          // {
          //   title: 'Το Μητρώο μου',
          //   icon: { icon: 'tabler-book-2' },
          //   to: 'myregistry',
          //   // authority: 'myregistry',
          // },
          // {
          //   title: 'Εγκύκλιοι',
          //   icon: { icon: 'tabler-box-multiple' },
          //   to: 'circulars',
          //   // authority: 'circulars',
          // },
          //
          // {
          //   title: 'Αιτήσεις',
          //   to: 'submissions',
          //   icon: { icon: 'tabler-box-multiple' },
          //   // authority: 'submissions',
          //   children: [
          //     {
          //       title: 'Οι Αιτήσεις μου',
          //       icon: { icon: 'tabler-file-description' },
          //       to: {
          //         name: 'submissions-category',
          //         params: {
          //           category: 'mysubmissions',
          //         },
          //       },
          //       // authority: 'submissions',
          //     },
          //     {
          //       title: 'Αιτήσεις Μετάθεσης',
          //       icon: { icon: 'tabler-file-description' },
          //       path: '/submissions/transfer/',
          //       to: {
          //         name: 'submissions-category',
          //         params: {
          //           category: 'transfer',
          //         },
          //       },
          //       // authority: 'submissions',
          //     },
          //     {
          //       title: 'Αιτήσεις Απόσπασης',
          //       icon: { icon: 'tabler-file-description' },
          //       to: {
          //         name: 'submissions-category',
          //         params: {
          //           category: 'secondment',
          //         },
          //       },
          //       // authority: 'submissions',
          //     },
          //     {
          //       title: 'Αιτήσεις Μετάταξης',
          //       icon: { icon: 'tabler-file-description' },
          //       to: {
          //         name: 'submissions-category',
          //         params: {
          //           category: 'reassignment',
          //         },
          //       },
          //       // authority: 'submissions',
          //     },
          //     {
          //       title: 'Αιτήσεις Μητρώου',
          //       icon: { icon: 'tabler-file-description' },
          //       to: {
          //         name: 'submissions-category',
          //         params: {
          //           category: 'registry',
          //         },
          //       },
          //       // authority: 'submissions',
          //     },
          //     {
          //       title: 'Λοιπές Αιτήσεις',
          //       icon: { icon: 'tabler-file-description' },
          //       to: {
          //         name: 'submissions-category',
          //         params: {
          //           category: 'other',
          //         },
          //       },
          //       // authority: 'submissions',
          //     },
          //   ],
          // },
          // {
          //   title: 'Ενημέρωση',
          //   icon: { icon: 'tabler-news' },
          //
          //   to: 'updates',
          //   // authority: 'updates',
          // },
          // {
          //   title: 'Ημερολόγιο',
          //   icon: { icon: 'tabler-calendar-month' },
          //
          //   to: 'calendar',
          //   // authority: 'calendar',
          // },
          // {
          //   title: 'Σύνδεσμοι',
          //   icon: { icon: 'tabler-link' },
          //
          //   to: 'links',
          //   // authority: 'announcements',
          // },
          // {
          //   title: 'Ρυθμίσεις',
          //   icon: { icon: 'tabler-settings' },
          //
          //   to: 'settings',
          //   // authority: 'settings',
          // },
  ]
    // .filter(entry => store.userRights.includes(`${entry.authority}_view` || `${entry.authority}_edit`))
}
export default menu

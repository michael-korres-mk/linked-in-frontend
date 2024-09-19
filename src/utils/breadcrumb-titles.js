const breadcrumbTitles = new Map([
  ["home","Home Page"],
  ["users", "User Management"],


  // ##########################################################################
    // ###############-----           C O M M O N            -----###############
    // ##########################################################################
    // {
    //   path: '/profile-completion',
    //   name: 'profile-completion',
    //   meta: {
    //     admin: false,
    //     breadcrumbTitle: 'Student Select',
    //   },
    //   component: () => import('../views/ProfileCompletion.vue'),
    // },
    //
    // {
    //   path: '/student-select-wizard',
    //   name: 'student-select-wizard',
    //   meta: {
    //     admin: false,
    //     breadcrumbTitle: 'Student Select',
    //   },
    //   component: () => import('../views/StudentSelectWizard.vue'),
    // },
    //
    // // ##########################################################################
    // // ###############-----            A D M I N             -----###############
    // // ##########################################################################
    //
    // {
    //   path: '/admin',
    //   name: 'admin-dashboard',
    //   meta: {
    //     admin: true,
    //   },
    //   component: () => import('../views/admin/[id].vue'),
    // },
    //
    // // <-----Admin Announcements----->
    // {
    //   path: '/admin/announcements-list',
    //   name: 'admin-announcements-list',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Announcements',
    //     authority: 'announcements_view',
    //   },
    //   component: () => import('../views/admin/announcements/List.vue'),
    // },
    // {
    //   path: '/admin/announcements-edit/:id?',
    //   name: 'admin-announcements-edit',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Announcement',
    //   },
    //   component: () => import('../views/admin/announcements/Edit.vue'),
    // },
    // {
    //   path: '/admin/announcements-responses/:id?',
    //   name: 'admin-announcements-responses',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Response List',
    //     authority: 'announcements_edit',
    //   },
    //   component: () => import('../views/admin/announcements/Responses.vue'),
    // },
    //
    // // <-----Admin Taught Materials----->
    //
    // {
    //   path: '/admin/taught-materials-list',
    //   name: 'admin-taught-materials-list',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Taught Materials',
    //   },
    //   component: () => import('../views/admin/taught-materials/List.vue'),
    // },
    // {
    //   path: '/admin/taught-materials-edit/:id?',
    //   name: 'admin-taught-materials-edit',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Taught Material',
    //   },
    //   component: () => import('../views/admin/taught-materials/Edit.vue'),
    // },
    //
    // // <-----Admin Events----->
    // {
    //   path: '/admin/events-list',
    //   name: 'admin-events-list',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Events',
    //   },
    //   component: () => import('../views/admin/events/List.vue'),
    // },
    // {
    //   path: '/admin/events-edit/:id?',
    //   name: 'admin-events-edit',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Events',
    //   },
    //   component: () => import('../views/admin/events/Edit.vue'),
    // },
    // {
    //   path: '/admin/events-responses/:id?',
    //   name: 'admin-events-responses',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Response List',
    //     authority: 'events_edit',
    //   },
    //   component: () => import('../views/admin/events/Responses.vue'),
    // },
    //
    // // <-----teacher Absences----->
    // {
    //   path: '/admin/absences-list',
    //   name: 'admin-absences-list',
    //   meta: {
    //     admin: false,
    //     breadcrumbTitle: 'Absences',
    //     authority: 'absences_view',
    //   },
    //   component: () => import('../views/admin/absences/List.vue'),
    // },
    //
    // // <-----Admin Assessments----->
    // {
    //   path: '/admin/assessments-list',
    //   name: 'admin-assessments-list',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Assessments',
    //   },
    //   component: () => import('../views/admin/assessments/List.vue'),
    // },
    // {
    //   path: '/admin/assessments-edit/:id?',
    //   name: 'admin-assessments-edit',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Assessments',
    //   },
    //   component: () => import('../views/admin/assessments/Edit.vue'),
    // },
    //
    // // <-----Admin Meetings----->
    // {
    //   path: '/admin/meetings-list',
    //   name: 'admin-meetings-list',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Meetings',
    //   },
    //   component: () => import('../views/admin/meetings/List.vue'),
    // },
    // {
    //   path: '/admin/meetings-edit/:id?',
    //   name: 'admin-meetings-edit',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Meetings',
    //   },
    //   component: () => import('../views/admin/meetings/Edit.vue'),
    // },
    //
    // // ##########################################################################
    // // ###############-----        G U A R D I A N S         -----###############
    // // ##########################################################################
    //
    // {
    //   path: '/guardian',
    //   name: 'guardian-dashboard',
    //   component: () => import('../views/guardian/[id].vue'),
    // },
    //
    // // <-----Guardian Announcements----->
    // {
    //   path: '/guardian/announcements-list',
    //   name: 'guardian-announcements-list',
    //   meta: {
    //     admin: false,
    //     backRoute: 'guardian-dashboard',
    //     breadcrumbTitle: 'Announcements',
    //     authority: 'announcements_view',
    //   },
    //   component: () => import('../views/guardian/announcements/List.vue'),
    // },
    // {
    //   path: '/guardian/announcements-edit/:id?',
    //   name: 'guardian-announcements-edit',
    //   meta: {
    //     admin: false,
    //     backRoute: 'guardian-announcements-list',
    //     breadcrumbTitle: 'Announcement',
    //     authority: 'announcements_view',
    //   },
    //   component: () => import('../views/guardian/announcements/Edit.vue'),
    // },
    // {
    //   path: '/guardian/absences/:id',
    //   name: 'guardian-absences',
    //   meta: {
    //     admin: false,
    //     backRoute: 'guardian-dashboard',
    //     breadcrumbTitle: 'Absences',
    //     authority: 'absences_view',
    //   },
    //   component: () => import('../views/guardian/absences/View.vue'),
    // },
    // {
    //   path: '/guardian/grades/:id',
    //   name: 'guardian-grades',
    //   meta: {
    //     admin: false,
    //     backRoute: 'guardian-dashboard',
    //     breadcrumbTitle: 'Grades List',
    //     authority: 'grades_view',
    //   },
    //   component: () => import('../views/guardian/grades/View.vue'),
    // },
    //
    // // <-----Guardian Taught Materials----->
    // // {
    // //   path: '/guardian/taught-materials-edit',
    // //   name: 'guardian-taught-materials-edit',
    // //   meta: {
    // // 	  admin: false,
    // //     breadcrumbTitle: 'Taught Material',
    // //     authority: 'taught_view',
    // //   },
    // //   component: () => import('../views/guardian/taught-materials/Edit.vue'),
    // // },
    // {
    //   path: '/guardian/taught-materials-edit/:id?',
    //   name: 'guardian-taught-materials-edit',
    //   meta: {
    //     admin: false,
    //     breadcrumbTitle: 'Taught Material',
    //     authority: 'taught_view',
    //   },
    //   component: () => import('../views/guardian/taught-materials/Edit.vue'),
    // },
    // {
    //   path: '/guardian/taught-materials-list',
    //   name: 'guardian-taught-materials-list',
    //   meta: {
    //     admin: false,
    //     breadcrumbTitle: 'Taught Materials List',
    //     authority: 'taught_view',
    //   },
    //   component: () => import('../views/guardian/taught-materials/List.vue'),
    // },
    //
    // // <-----Guardian Events----->
    // {
    //   path: '/guardian/events-list',
    //   name: 'guardian-events-list',
    //   meta: {
    //     admin: false,
    //     breadcrumbTitle: 'Events',
    //     authority: 'events_view',
    //   },
    //   component: () => import('../views/guardian/events/List.vue'),
    // },
    // {
    //   path: '/guardian/events-edit/:id?',
    //   name: 'guardian-events-edit',
    //   meta: {
    //     admin: false,
    //     breadcrumbTitle: 'Events',
    //     authority: 'events_view',
    //   },
    //   component: () => import('../views/guardian/events/Edit.vue'),
    // },
    // {
    //   path: '/guardian/events-statement',
    //   name: 'guardian-events-statement',
    //   meta: {
    //     admin: false,
    //     breadcrumbTitle: 'Event Statement',
    //     authority: 'events_acknowledge_edit',
    //   },
    //   component: () => import('../views/guardian/events/Statement.vue'),
    // },
    //
    // // <-----Guardian Assessments----->
    // {
    //   path: '/guardian/assessments-list',
    //   name: 'guardian-assessments-list',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Assessments',
    //     authority: 'assessments_view',
    //   },
    //   component: () => import('../views/guardian/assessments/List.vue'),
    // },
    // {
    //   path: '/guardian/assessments-edit/:id?',
    //   name: 'guardian-assessments-edit',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Assessments',
    //     authority: 'assessments_view',
    //   },
    //   component: () => import('../views/guardian/assessments/Edit.vue'),
    // },
    //
    // // <-----Guardian Meetings----->
    // {
    //   path: '/guardian/meetings-list',
    //   name: 'guardian-meetings-list',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Meetings',
    //   },
    //   component: () => import('../views/guardian/meetings/List.vue'),
    // },
    // {
    //   path: '/guardian/meetings-edit/:id?',
    //   name: 'guardian-meetings-edit',
    //   meta: {
    //     admin: true,
    //     breadcrumbTitle: 'Meetings',
    //   },
    //   component: () => import('../views/guardian/meetings/Edit.vue'),
    // },
    //
    // {
    //   path: '/changelog',
    //   name: 'changelog',
    //   meta: {
    //     breadcrumbTitle: 'Changelog',
    //   },
    //   component: () => import('@/views/Changelog.vue'),
    // },
]);

export default breadcrumbTitles

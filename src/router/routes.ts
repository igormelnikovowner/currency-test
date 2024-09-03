const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'convert', component: () => import('pages/ConvertPage.vue') },
    ],
  },
];

export default routes;

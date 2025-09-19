import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./core/auth/pages/auth.component')
      },
    ]
  },
  {
    path: 'main',
    loadComponent: () => import('./core/layout/layout.component'),
    children: [
      {
        title: 'Gestion de Dueños',
        path: 'duenios',
        loadComponent: () => import('./features/duenios/pages/duenios.component')
      },
      {
        title: 'Gestion de Mascotas',
        path: 'mascotas',
        loadComponent: () => import('./features/mascotas/pages/mascotas.component')
      },
      {
        title: 'Citas',
        path: 'citas',
        loadComponent: () => import('./features/citas/pages/citas.component')
      }
    ]
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
];

import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'register', loadComponent: () => import('./pages/registration/registration.component').then(m => m.RegistrationComponent) },
  { path: 'admin/login', loadComponent: () => import('./pages/admin/admin-login/admin-login.component').then(m => m.AdminLoginComponent) },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./pages/welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.page').then((m) => m.SignupPage),
  },

  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'map',
    loadComponent: () =>
      import('./pages/map/map.page').then((m) => m.MapPage),
  },
  {
    path: 'cleaning-schedule-page',
    loadComponent: () => import('./pages/cleaning-schedule-page/cleaning-schedule-page.page').then( m => m.CleaningSchedulePagePage)
  },
  {
    path: 'man-c',
    loadComponent: () => import('./pages/man-c/man-c.page').then( m => m.ManCPage)
  },

 
 
]
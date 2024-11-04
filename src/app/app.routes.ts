import { Routes } from '@angular/router';
import { MainComponent } from './components/pages/main/main.component';
import { MenuComponent } from './components/pages/menu/menu.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/main',
  },
  {
    path: 'main',
    component: MainComponent,
  },
  {
    path: 'menu',
    component: MenuComponent,
  },
];

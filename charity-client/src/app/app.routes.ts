import { Routes } from '@angular/router';
import { Home } from './home';
import { Search } from './search';
import { EventDetail } from './event-detail';
import { Register } from './register';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'search', component: Search },
  { path: 'event/:id', component: EventDetail },
  { path: 'register/:id', component: Register },
  { path: '**', redirectTo: '' }
];

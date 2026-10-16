import { Routes } from '@angular/router';
import { EventList } from './event-list';
import { EventForm } from './event-form';

export const routes: Routes = [
  { path: '', component: EventList },
  { path: 'new', component: EventForm },
  { path: 'edit/:id', component: EventForm },
  { path: '**', redirectTo: '' }
];

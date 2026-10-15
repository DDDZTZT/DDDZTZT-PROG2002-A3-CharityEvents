import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CharityEvent, EventService } from './event.service';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private eventService = inject(EventService);

  events = signal<CharityEvent[]>([]);
  loading = signal(true);
  error = signal('');

  constructor() {
    this.eventService.getEvents().subscribe({
      next: (list) => {
        this.events.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load events. Is the API running on port 3000?');
        this.loading.set(false);
      },
    });
  }
}

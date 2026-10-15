import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CharityEvent, EventService } from './event.service';

@Component({
  imports: [RouterLink],
  selector: 'app-event-detail',
  styleUrl: './event-detail.css',
  templateUrl: './event-detail.html',
})
export class EventDetail {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);

  event = signal<CharityEvent | null>(null);
  loading = signal(true);
  error = signal('');

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('No event id was provided.');
      this.loading.set(false);
      return;
    }
    this.eventService.getEvent(id).subscribe({
      next: (event) => {
        this.event.set(event);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load this event.');
        this.loading.set(false);
      },
    });
  }
}

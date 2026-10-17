import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService, CharityEvent } from './admin.service';

@Component({
  imports: [RouterLink],
  selector: 'app-event-list',
  styleUrl: './event-list.css',
  templateUrl: './event-list.html',
})
export class EventList {
  private admin = inject(AdminService);

  events = signal<CharityEvent[]>([]);
  loading = signal(true);
  error = signal('');
  deletingId = signal<number | null>(null);

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.admin.getAllEvents().subscribe({
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

  deleteEvent(event: CharityEvent) {
    const ok = confirm(`Delete "${event.event_name}"?`);
    if (!ok) return;

    this.deletingId.set(event.event_id);
    this.error.set('');

    this.admin.deleteEvent(event.event_id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.load();
      },
      error: (err) => {
        this.deletingId.set(null);
        if (err.status === 409) {
          this.error.set(`Cannot delete "${event.event_name}": it has registrations.`);
        } else {
          this.error.set('Delete failed. Please try again.');
        }
      },
    });
  }
}

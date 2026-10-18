import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CharityEvent, EventService } from './event.service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);

  event = signal<CharityEvent | null>(null);
  loadError = signal('');

  // The app runs in zoneless mode, so state changed inside async HTTP
  // callbacks MUST be a signal for the view to update.
  fullName = signal('');
  email = signal('');
  phone = signal('');
  tickets = signal(1);

  submitting = signal(false);
  message = signal('');
  error = signal('');

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEvent(id).subscribe({
      next: (event) => this.event.set(event),
      error: () => this.loadError.set('Failed to load event details.'),
    });
  }

  submit() {
    if (!this.fullName().trim() || !this.email().trim()) {
      this.error.set('Please enter your name and email.');
      return;
    }
    if (this.tickets() < 1) {
      this.error.set('Number of tickets must be at least 1.');
      return;
    }
    const eventId = this.event()?.event_id;
    if (!eventId) {
      this.error.set('Event has not loaded yet.');
      return;
    }

    this.submitting.set(true);
    this.error.set('');
    this.eventService
      .register({
        full_name: this.fullName().trim(),
        email: this.email().trim(),
        phone: this.phone().trim(),
        tickets: this.tickets(),
        event_id: eventId,
      })
      .subscribe({
        next: (res) => {
          this.submitting.set(false);
          this.message.set(
            'Registration successful! Your reference number is #' + res.registration_id + '.'
          );
        },
        error: (err) => {
          this.submitting.set(false);
          if (err.status === 409) {
            this.error.set('You have already registered for this event.');
          } else {
            this.error.set('Registration failed. Please try again.');
          }
        },
      });
  }
}

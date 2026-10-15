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

  // Form fields use plain properties (simplest with ngModel).
  fullName = '';
  email = '';
  phone = '';
  tickets = 1;

  submitting = false;
  message = '';
  error = '';

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEvent(id).subscribe({
      next: (event) => this.event.set(event),
      error: () => this.loadError.set('Failed to load event details.'),
    });
  }

  submit() {
    if (!this.fullName.trim() || !this.email.trim()) {
      this.error = 'Please enter your name and email.';
      return;
    }
    if (this.tickets < 1) {
      this.error = 'Number of tickets must be at least 1.';
      return;
    }
    const eventId = this.event()?.event_id;
    if (!eventId) {
      this.error = 'Event has not loaded yet.';
      return;
    }

    this.submitting = true;
    this.error = '';
    this.eventService
      .register({
        full_name: this.fullName.trim(),
        email: this.email.trim(),
        phone: this.phone.trim(),
        tickets: this.tickets,
        event_id: eventId,
      })
      .subscribe({
        next: (res) => {
          this.submitting = false;
          this.message =
            'Registration successful! Your reference number is #' + res.registration_id + '.';
        },
        error: (err) => {
          this.submitting = false;
          if (err.status === 409) {
            this.error = 'You have already registered for this event.';
          } else {
            this.error = 'Registration failed. Please try again.';
          }
        },
      });
  }
}

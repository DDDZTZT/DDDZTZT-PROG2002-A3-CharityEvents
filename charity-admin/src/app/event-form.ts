import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService, Category, CharityEvent, Organisation } from './admin.service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-event-form',
  styleUrl: './event-form.css',
  templateUrl: './event-form.html',
})
export class EventForm {
  private route = inject(ActivatedRoute);
  private admin = inject(AdminService);

  isEdit = false;
  editId: number | null = null;

  categories = signal<Category[]>([]);
  organisations = signal<Organisation[]>([]);
  event = signal<CharityEvent | null>(null);

  // Signals so the form re-renders after async load / save (zoneless app).
  event_name = signal('');
  description = signal('');
  event_date = signal('');
  start_time = signal('');
  location_name = signal('');
  address = signal('');
  city = signal('');
  latitude = signal<number | null>(null);
  longitude = signal<number | null>(null);
  ticket_price = signal(0);
  is_free = signal(false);
  status = signal('active');
  image_url = signal('');
  goal_amount = signal(0);
  raised_amount = signal(0);
  organisations_org_id = signal<number | null>(null);
  categories_category_id = signal<number | null>(null);

  submitting = signal(false);
  message = signal('');
  error = signal('');

  constructor() {
    // Dropdown data.
    this.admin.getCategories().subscribe({
      next: (c) => this.categories.set(c),
      error: () => {},
    });
    this.admin.getOrganisations().subscribe({
      next: (o) => this.organisations.set(o),
      error: () => {},
    });

    // Edit mode: load the event (and its registrations).
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEdit = true;
      this.editId = id;
      this.admin.getEvent(id).subscribe({
        next: (event) => {
          this.event.set(event);
          this.fillForm(event);
        },
        error: () => this.error.set('Failed to load this event.'),
      });
    }
  }

  fillForm(event: CharityEvent) {
    this.event_name.set(event.event_name);
    this.description.set(event.description || '');
    this.event_date.set(event.event_date || '');
    this.start_time.set(event.start_time || '');
    this.location_name.set(event.location_name || '');
    this.address.set(event.address || '');
    this.city.set(event.city || '');
    this.latitude.set(event.latitude != null ? Number(event.latitude) : null);
    this.longitude.set(event.longitude != null ? Number(event.longitude) : null);
    this.ticket_price.set(Number(event.ticket_price) || 0);
    this.is_free.set(!!event.is_free);
    this.status.set(event.status || 'active');
    this.image_url.set(event.image_url || '');
    this.goal_amount.set(Number(event.goal_amount) || 0);
    this.raised_amount.set(Number(event.raised_amount) || 0);
    this.organisations_org_id.set(event.organisations_org_id);
    this.categories_category_id.set(event.categories_category_id);
  }

  submit() {
    if (
      !this.event_name() ||
      !this.event_date() ||
      !this.organisations_org_id() ||
      !this.categories_category_id()
    ) {
      this.error.set('Please fill in name, date, organisation and category.');
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    const body = {
      event_name: this.event_name(),
      description: this.description(),
      event_date: this.event_date(),
      start_time: this.start_time(),
      location_name: this.location_name(),
      address: this.address(),
      city: this.city(),
      latitude: this.latitude(),
      longitude: this.longitude(),
      ticket_price: this.ticket_price(),
      is_free: this.is_free() ? 1 : 0,
      status: this.status(),
      image_url: this.image_url(),
      goal_amount: this.goal_amount(),
      raised_amount: this.raised_amount(),
      organisations_org_id: this.organisations_org_id(),
      categories_category_id: this.categories_category_id(),
    };

    const request = this.isEdit
      ? this.admin.updateEvent(this.editId!, body)
      : this.admin.createEvent(body);

    request.subscribe({
      next: () => {
        this.submitting.set(false);
        this.message.set(
          this.isEdit ? 'Event updated successfully.' : 'Event created successfully.'
        );
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('Save failed. Please check the fields and try again.');
      },
    });
  }
}

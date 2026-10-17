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

  // Form fields (plain properties, simplest with ngModel).
  event_name = '';
  description = '';
  event_date = '';
  start_time = '';
  location_name = '';
  address = '';
  city = '';
  latitude: number | null = null;
  longitude: number | null = null;
  ticket_price: number = 0;
  is_free = false;
  status = 'active';
  image_url = '';
  goal_amount: number = 0;
  raised_amount: number = 0;
  organisations_org_id: number | null = null;
  categories_category_id: number | null = null;

  submitting = false;
  message = '';
  error = '';

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
        error: () => (this.error = 'Failed to load this event.'),
      });
    }
  }

  fillForm(event: CharityEvent) {
    this.event_name = event.event_name;
    this.description = event.description || '';
    this.event_date = event.event_date || '';
    this.start_time = event.start_time || '';
    this.location_name = event.location_name || '';
    this.address = event.address || '';
    this.city = event.city || '';
    this.latitude = event.latitude != null ? Number(event.latitude) : null;
    this.longitude = event.longitude != null ? Number(event.longitude) : null;
    this.ticket_price = Number(event.ticket_price) || 0;
    this.is_free = !!event.is_free;
    this.status = event.status || 'active';
    this.image_url = event.image_url || '';
    this.goal_amount = Number(event.goal_amount) || 0;
    this.raised_amount = Number(event.raised_amount) || 0;
    this.organisations_org_id = event.organisations_org_id;
    this.categories_category_id = event.categories_category_id;
  }

  submit() {
    if (
      !this.event_name ||
      !this.event_date ||
      !this.organisations_org_id ||
      !this.categories_category_id
    ) {
      this.error = 'Please fill in name, date, organisation and category.';
      return;
    }

    this.submitting = true;
    this.error = '';

    const body = {
      event_name: this.event_name,
      description: this.description,
      event_date: this.event_date,
      start_time: this.start_time,
      location_name: this.location_name,
      address: this.address,
      city: this.city,
      latitude: this.latitude,
      longitude: this.longitude,
      ticket_price: this.ticket_price,
      is_free: this.is_free ? 1 : 0,
      status: this.status,
      image_url: this.image_url,
      goal_amount: this.goal_amount,
      raised_amount: this.raised_amount,
      organisations_org_id: this.organisations_org_id,
      categories_category_id: this.categories_category_id,
    };

    const request = this.isEdit
      ? this.admin.updateEvent(this.editId!, body)
      : this.admin.createEvent(body);

    request.subscribe({
      next: () => {
        this.submitting = false;
        this.message = this.isEdit ? 'Event updated successfully.' : 'Event created successfully.';
      },
      error: () => {
        this.submitting = false;
        this.error = 'Save failed. Please check the fields and try again.';
      },
    });
  }
}

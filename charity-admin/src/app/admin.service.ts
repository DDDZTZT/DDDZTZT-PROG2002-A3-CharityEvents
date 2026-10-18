import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

// Base URL of the Express API.
// Locally it points to the dev server; on cPanel it points to the deployed API.
const API_BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://24832012.it.scu.edu.au/api';

export interface Registration {
  registration_id: number;
  full_name: string;
  email: string;
  phone: string | null;
  tickets: number;
  registration_date: string;
  event_id: number;
}

export interface CharityEvent {
  event_id: number;
  event_name: string;
  description: string;
  event_date: string;
  start_time: string;
  location_name: string;
  address: string;
  city: string;
  latitude: string | number | null;
  longitude: string | number | null;
  ticket_price: string | number;
  is_free: number;
  status: string;
  image_url: string;
  goal_amount: string | number;
  raised_amount: string | number;
  organisations_org_id: number;
  categories_category_id: number;
  registrations?: Registration[];
}

export interface Category {
  category_id: number;
  category_name: string;
  description: string;
}

export interface Organisation {
  org_id: number;
  org_name: string;
  mission: string;
  phone: string;
  contact_email: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);

  // List all events, regardless of status (active / past / suspended).
  getAllEvents() {
    return this.http.get<CharityEvent[]>(`${API_BASE}/events?all=true`);
  }

  // One event plus its registrations (used by the edit form).
  getEvent(id: number) {
    return this.http.get<CharityEvent>(`${API_BASE}/events/${id}`);
  }

  getCategories() {
    return this.http.get<Category[]>(`${API_BASE}/categories`);
  }

  getOrganisations() {
    return this.http.get<Organisation[]>(`${API_BASE}/organisations`);
  }

  createEvent(body: Partial<CharityEvent>) {
    return this.http.post<{ message: string; event_id: number }>(`${API_BASE}/events`, body);
  }

  updateEvent(id: number, body: Partial<CharityEvent>) {
    return this.http.put<{ message: string }>(`${API_BASE}/events/${id}`, body);
  }

  deleteEvent(id: number) {
    return this.http.delete<{ message: string }>(`${API_BASE}/events/${id}`);
  }
}

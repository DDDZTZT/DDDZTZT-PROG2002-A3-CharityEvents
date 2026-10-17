import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

// Base URL of the Express API. Change this when deploying to cPanel
// (e.g. https://your-cpanel-domain/api).
const API_BASE = 'http://localhost:3000/api';

// A single registration row, as returned by the API.
export interface Registration {
  registration_id: number;
  full_name: string;
  email: string;
  phone: string | null;
  tickets: number;
  registration_date: string;
  event_id: number;
}

// A charity event, as returned by the API. The API also attaches a
// `registrations` array to the single-event endpoint.
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

// Shape of the Open-Meteo forecast response (the part we use).
export interface OpenMeteoResponse {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

// Single service that wraps every API call the client needs.
@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);

  // Home page: active events in the future.
  getEvents() {
    return this.http.get<CharityEvent[]>(`${API_BASE}/events`);
  }

  getCategories() {
    return this.http.get<Category[]>(`${API_BASE}/categories`);
  }

  // Search page: filters are passed as query parameters.
  searchEvents(filters: { date?: string; location?: string; category?: string }) {
    return this.http.get<CharityEvent[]>(`${API_BASE}/events/search`, { params: filters });
  }

  // Event detail page: one event plus its registrations (newest first).
  getEvent(id: number) {
    return this.http.get<CharityEvent>(`${API_BASE}/events/${id}`);
  }

  // Weather forecast for an event location (external Open-Meteo API).
  getWeather(latitude: number, longitude: number) {
    const url =
      'https://api.open-meteo.com/v1/forecast' +
      '?latitude=' + latitude +
      '&longitude=' + longitude +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
      '&timezone=Australia%2FSydney';
    return this.http.get<OpenMeteoResponse>(url);
  }

  // Registration page: submit a new registration.
  register(body: {
    full_name: string;
    email: string;
    phone?: string;
    tickets: number;
    event_id: number;
  }) {
    return this.http.post<{ message: string; registration_id: number }>(
      `${API_BASE}/registrations`,
      body
    );
  }
}

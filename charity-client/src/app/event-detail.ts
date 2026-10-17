import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CharityEvent, EventService } from './event.service';

interface WeatherDay {
  date: string;
  text: string;
  max: number;
  min: number;
}

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
  weather = signal<WeatherDay[]>([]);

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
        if (event.latitude && event.longitude) {
          this.loadWeather(Number(event.latitude), Number(event.longitude));
        }
      },
      error: () => {
        this.error.set('Failed to load this event.');
        this.loading.set(false);
      },
    });
  }

  // Fetch the Open-Meteo forecast for the event location.
  private loadWeather(latitude: number, longitude: number) {
    this.eventService.getWeather(latitude, longitude).subscribe({
      next: (res) => {
        const daily = res?.daily;
        if (!daily || !daily.time) return;
        const days: WeatherDay[] = daily.time.map((date, i) => ({
          date: date,
          text: this.weatherText(daily.weather_code[i]),
          max: daily.temperature_2m_max[i],
          min: daily.temperature_2m_min[i],
        }));
        this.weather.set(days);
      },
      error: () => {
        // Weather is an optional extra; ignore any failure silently.
      },
    });
  }

  // Translate Open-Meteo weather codes into readable text.
  private weatherText(code: number): string {
    if (code === 0) return 'Clear sky';
    if (code === 1 || code === 2) return 'Mainly clear / partly cloudy';
    if (code === 3) return 'Overcast';
    if (code === 45 || code === 48) return 'Fog';
    if (code === 51 || code === 53 || code === 55) return 'Drizzle';
    if (code === 61 || code === 63 || code === 65) return 'Rain';
    if (code === 80 || code === 81 || code === 82) return 'Rain showers';
    if (code === 95) return 'Thunderstorm';
    return 'Unknown';
  }
}

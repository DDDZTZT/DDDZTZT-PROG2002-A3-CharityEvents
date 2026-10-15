import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Category, CharityEvent, EventService } from './event.service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-search',
  styleUrl: './search.css',
  templateUrl: './search.html',
})
export class Search {
  private eventService = inject(EventService);

  categories = signal<Category[]>([]);

  date = '';
  location = '';
  category = '';

  results: CharityEvent[] = [];
  searched = false;
  message = '';

  constructor() {
    this.eventService.getCategories().subscribe({
      next: (list) => this.categories.set(list),
      error: () => {},
    });
  }

  search() {
    if (!this.date && !this.location && !this.category) {
      this.message = 'Please select at least one filter.';
      return;
    }
    this.message = '';

    const filters: { date?: string; location?: string; category?: string } = {};
    if (this.date) filters.date = this.date;
    if (this.location) filters.location = this.location;
    if (this.category) filters.category = this.category;

    this.eventService.searchEvents(filters).subscribe({
      next: (list) => {
        this.results = list;
        this.searched = true;
      },
      error: () => {
        this.message = 'Search failed. Please try again.';
      },
    });
  }

  clear() {
    this.date = '';
    this.location = '';
    this.category = '';
    this.results = [];
    this.searched = false;
    this.message = '';
  }
}

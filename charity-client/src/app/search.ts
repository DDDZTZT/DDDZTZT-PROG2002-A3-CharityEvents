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

  // Signals so async search results update the view (zoneless app).
  date = signal('');
  location = signal('');
  category = signal('');

  results = signal<CharityEvent[]>([]);
  searched = signal(false);
  message = signal('');

  constructor() {
    this.eventService.getCategories().subscribe({
      next: (list) => this.categories.set(list),
      error: () => {},
    });
  }

  search() {
    if (!this.date() && !this.location() && !this.category()) {
      this.message.set('Please select at least one filter.');
      return;
    }
    this.message.set('');

    const filters: { date?: string; location?: string; category?: string } = {};
    if (this.date()) filters.date = this.date();
    if (this.location()) filters.location = this.location();
    if (this.category()) filters.category = this.category();

    this.eventService.searchEvents(filters).subscribe({
      next: (list) => {
        this.results.set(list);
        this.searched.set(true);
      },
      error: () => {
        this.message.set('Search failed. Please try again.');
      },
    });
  }

  clear() {
    this.date.set('');
    this.location.set('');
    this.category.set('');
    this.results.set([]);
    this.searched.set(false);
    this.message.set('');
  }
}

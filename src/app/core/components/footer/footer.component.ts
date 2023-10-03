import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { FilterEnum } from '../../constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class FooterComponent {
  public todoService = inject(TodoService);
  public filters = this.todoService.filters;
  public filterEnum = FilterEnum;

  public activeCount = computed(() => {
    return this.todoService.todos().filter(todo => !todo.isCompleted).length;
  });

  public noTodos = computed(() => this.todoService.todos().length === 0);
  public itemsLeftText = computed(() => `item${this.activeCount() !== 1 ? 's' : ''} left`);

  changeFilter(event: Event, filterName: FilterEnum): void {
    event.preventDefault();
    this.todoService.changeFilter(filterName);
  }
}

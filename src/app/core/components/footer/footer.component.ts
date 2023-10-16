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
  /** Inject TodoService to this component */
  public todoService = inject(TodoService);

  /** Get filters signal from the service */
  public filters = this.todoService.filters;
  /** Set enum values to variable */
  public filterEnum = FilterEnum;

  /** To get the total length of active todos */
  public activeCount = computed(() => {
    return this.todoService.todos().filter(todo => !todo.isCompleted).length;
  });

  /** To check if there are no todos */
  public noTodos = computed(() => this.todoService.todos().length === 0);
  
  /** To set the the `count items left` string to the footer  */
  public itemsLeftText = computed(() => `item${this.activeCount() !== 1 ? 's' : ''} left`);

  
  /**
   * @param event to prevent the click of anchor tags
   * @param filterName to get the filter name
   * @description this method is used to set the filter name value
   */
  changeFilter(event: Event, filterName: FilterEnum): void {
    event.preventDefault();
    this.todoService.changeFilter(filterName);
  }
}

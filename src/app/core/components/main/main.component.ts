import { Component, computed, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { CommonModule } from '@angular/common';
import { FilterEnum } from '../../constants';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  standalone: true,
  imports: [CommonModule, TodoItemComponent]
})
export class MainComponent {
  public todoService = inject(TodoService);
  public editingId: string | null = null;

  public visibleTodos = computed(() => {
    const todos = this.todoService.todos();
    const filters = this.todoService.filters();

    if (filters === FilterEnum.active) {
      return todos.filter(todo => !todo.isCompleted)
    } else if (filters === FilterEnum.completed) {
      return todos.filter(todo => todo.isCompleted)
    }
    return todos;
  })

  public noTodos = computed(() => this.todoService.todos().length === 0);

  setEditingId(editingId: string | null): void {
    this.editingId = editingId;
  }
}

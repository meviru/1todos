import { Component, computed, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { CommonModule } from '@angular/common';
import { FilterEnum } from '../../constants';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo } from '../../models/todo.model';
import { take } from 'rxjs';

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
  public isLoading: boolean = false;

  public visibleTodos = computed(() => {
    const todos: Todo[] = this.todoService.todos();
    const filters = this.todoService.filters();
    if (filters === FilterEnum.active) {
      return todos.filter(todo => !todo.isCompleted)
    } else if (filters === FilterEnum.completed) {
      return todos.filter(todo => todo.isCompleted)
    }
    return todos;
  })

  public noTodos = computed(() => this.todoService.todos().length === 0);

  ngOnInit(): void {
    this.getTodos();
    this.todoService.isTodoUpdated.subscribe((isAdded) => {
      if (isAdded) {
        this.getTodos();
      }
    })
  }

  getTodos() {
    this.isLoading = true;
    this.todoService.getTodos().subscribe((result) => {
      const response = this.generateId(result);
      this.todoService.todos.set(response);
      this.isLoading = false;
    });
  }

  generateId(tasks: Todo[]): Todo[] {
    for (let [key, value] of Object.entries(tasks)) {
      value['id'] = key;
    }
    return Object.values(tasks);
  }

  setEditingId(editingId: string | null): void {
    this.editingId = editingId;
  }
}

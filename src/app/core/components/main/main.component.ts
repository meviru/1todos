import { Component, computed, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { CommonModule } from '@angular/common';
import { FilterEnum } from '../../constants';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  standalone: true,
  imports: [CommonModule, TodoItemComponent]
})

export class MainComponent {
  /** Inject TodoService to this component */
  public todoService = inject(TodoService);

  /** public variables */
  public editingId: string | null = null;
  public isLoading: boolean = false;

  /** 
   * @description This signal is used to get the computed value of todos list 
   * and the filtered todos list as well 
  */
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


  /**
   * @description to get the todos and also to check an 
   * observable if the new todo is added or not
   */
  ngOnInit(): void {
    this.getTodos();
    this.todoService.isTodoUpdated.subscribe((isAdded) => {
      if (isAdded) {
        this.getTodos();
      }
    })
  }

  /**
   * @description to get the todos list from the api
   */
  getTodos() {
    this.isLoading = true;
    this.todoService.getTodos().subscribe((result) => {
      const response = this.generateId(result);
      this.todoService.todos.set(response);
      this.isLoading = false;
    });
  }

  /**
   * @param todos to get the todos list
   * @returns returns the reformed array with updated id based on firebase
   */
  generateId(todos: Todo[]): Todo[] {
    for (let [key, value] of Object.entries(todos)) {
      value['id'] = key;
    }
    return Object.values(todos);
  }

  /**
   * @param editingId to get the editing id
   * @description this method is used to set the flag based on the edited todo
   */
  setEditingId(editingId: string | null): void {
    this.editingId = editingId;
  }
}

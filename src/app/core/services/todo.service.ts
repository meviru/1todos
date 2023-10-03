import { Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo.model';
import { FilterEnum } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  public todos;
  public filters;

  constructor() {
    this.todos = signal<Todo[]>([]);
    this.filters = signal<FilterEnum>(FilterEnum.all);
  }

  changeFilter(filterName: FilterEnum): void {
    this.filters.set(filterName);
  }

  addTodo(text: string): void {
    const newTodo: Todo = {
      text,
      isCompleted: false,
      id: Math.random().toString(16)
    }
    this.todos.update(todos => [...todos, newTodo]);
  }

  updateTodo(id: string, text: string): void {
    this.todos.update(todos => todos.map(todo => todo.id === id ? { ...todo, text } : todo));
  }

  removeTodo(id: string): void {
    this.todos.update(todos => todos.filter(todo => todo.id !== id));
  }

  toggleTodo(id: string): void {
    this.todos.update(todos => todos.map(todo => todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo));
  }
}

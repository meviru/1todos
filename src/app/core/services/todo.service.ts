import { Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo.model';
import { FilterEnum, config } from '../constants';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, take } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TodoService {
  public todos;
  public filters;

  public api_url: string = config.api_url;

  public isTodoUpdated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.todos = signal<Todo[]>([]);
    this.filters = signal<FilterEnum>(FilterEnum.all);
  }

  changeFilter(filterName: FilterEnum): void {
    this.filters.set(filterName);
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.api_url}/todo.json`);
  }

  addTodo(text: string): Observable<Todo> {
    const newTodo: Todo = {
      text,
      isCompleted: false,
      id: Math.random().toString(16)
    }
    this.todos.update(todos => [...todos, newTodo]);
    return this.http.post<Todo>(`${this.api_url}/todo.json`, newTodo);
  }

  updateTodo(id: string, text: string): Observable<object> {
    const textObj = { text: text };
    this.todos.update(todos => todos.map(todo => todo.id === id ? { ...todo, text } : todo));
    return this.http.patch(`${this.api_url}/todo/${id}.json`, textObj);
  }

  removeTodo(id: string): void {
    this.todos.update(todos => todos.filter(todo => todo.id !== id));
    this.http.delete(`${this.api_url}/todo/${id}.json`).pipe(take(1)).subscribe();
  }

  toggleTodo(id: string): Observable<object> {
    const allTodos: Todo[] = this.todos();
    const selectedTodo = allTodos.find(todo => todo.id === id);
    const isCompleted = { isCompleted: !selectedTodo?.isCompleted };
    this.todos.update(todos => todos.map(todo => todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo));
    return this.http.patch(`${this.api_url}/todo/${id}.json`, isCompleted);
  }
}

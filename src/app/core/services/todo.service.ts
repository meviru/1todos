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

  /**
   * @param filterName to get the filtername
   * @description This method is used to set the filter
   */
  changeFilter(filterName: FilterEnum): void {
    this.filters.set(filterName);
  }

  /**
   * @returns the list of todo list as an observables
   * @description this method is used to get the todos
   */
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.api_url}/todo.json`);
  }

  /**
   * @param text to get the text value
   * @returns the result of newly added todo
   * @description this method is used to add a new todo
   */
  addTodo(text: string): Observable<Todo> {
    const newTodo: Todo = {
      text,
      isCompleted: false,
      id: Math.random().toString(16)
    }
    this.todos.update(todos => [...todos, newTodo]);
    return this.http.post<Todo>(`${this.api_url}/todo.json`, newTodo);
  }

  /**
   * @param id to get the todo id
   * @param text  to get the text to update
   * @description this method is used to update the todo
   */
  updateTodo(id: string, text: string): void {
    const textObj = { text: text };
    this.todos.update(todos => todos.map(todo => todo.id === id ? { ...todo, text } : todo));
    this.http.patch(`${this.api_url}/todo/${id}.json`, textObj).pipe(take(1)).subscribe();
  }

  /**
   * @param id to get the todo id
   * @description this method is used to remove the todo
   */
  removeTodo(id: string): void {
    this.todos.update(todos => todos.filter(todo => todo.id !== id));
    this.http.delete(`${this.api_url}/todo/${id}.json`).pipe(take(1)).subscribe();
  }

  /**
   * @param id to get the todo id
   * @description this method is used to toggle the status of todo
   */
  toggleTodo(id: string): void {
    const allTodos: Todo[] = this.todos();
    const selectedTodo = allTodos.find(todo => todo.id === id);
    const isCompleted = { isCompleted: !selectedTodo?.isCompleted };
    this.todos.update(todos => todos.map(todo => todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo));
    this.http.patch(`${this.api_url}/todo/${id}.json`, isCompleted).pipe(take(1)).subscribe();
  }
}

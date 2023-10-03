import { Component, inject, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true
})
export class HeaderComponent {
  public todoService = inject(TodoService);
  public text;

  constructor() {
    this.text = '';
  }

  onChangeText(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.text = target.value;
  }

  onEnter(event: Event): void {
    this.todoService.addTodo(this.text);
    this.text = '';
  }
}

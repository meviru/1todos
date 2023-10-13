import { Component, inject, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true
})
export class HeaderComponent {
  public todoService = inject(TodoService);

  public text;
  public isError: boolean = false;

  constructor() {
    this.text = '';
  }

  onChangeText(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.text = target.value;
  }

  onEnter(event: Event): void {
    if (this.text == "" || this.text.trim() == "") {
      this.isError = true;
    } else {
      this.todoService.addTodo(this.text.trim()).pipe(take(1)).subscribe((response) => {
        this.todoService.isTodoUpdated.next(true);
      });
      this.text = '';
      this.isError = false;
    }
  }
}

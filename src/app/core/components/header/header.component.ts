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
  /** Inject TodoService to this component */
  public todoService = inject(TodoService);

  /** public variables */
  public text;
  public isError: boolean = false;

  constructor() {
    this.text = '';
  }

  /**
   * @param event to get the value from the text input
   * @description this method is used to set the value into variable
   */
  onChangeText(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.text = target.value;
  }

  /**
   * @description this method is used to make api call to add todo item.
   * This method also checks the validation of blank submission
   */
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

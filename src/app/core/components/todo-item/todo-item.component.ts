import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TodoItemComponent {
  /** Inject TodoService to this component */
  public todoService = inject(TodoService);

  /** Get todo item detail */
  @Input({ required: true }) todo!: Todo;
  /** Get isEditing flag */
  @Input({ required: true }) isEditing!: boolean;
  /** Set EditingId to get the isEditing flag  */
  @Output() setEditingId: EventEmitter<string | null> = new EventEmitter();
  /** To get the edit input text ref */
  @ViewChild('textInput') textInput?: ElementRef;

  /** public variables */
  public editingText: string = '';
  public isError: boolean = false;

  /**
   * @description To set the text to edit input box on init
   */
  ngOnInit(): void {
    this.editingText = this.todo.text;
  }

  /**
   * @param event to get the value from the text input
   * @description this method is used to set the value into variable
   */
  changeText(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.editingText = text;
  }

  /**
   * @description this method is used to make api call to update todo item.
   * This method also checks the validation of blank submission
   */
  onEdit(): void {
    if (this.editingText == "" || this.editingText.trim() == "") {
      this.isError = true;
    } else {
      this.setEditingId.emit(null);
      this.todoService.updateTodo(this.todo.id, this.editingText.trim());
      this.isError = false;
    }
  }

  /**
   * @description this method is used to set the focus into input 
   * when double click on the label and set the editing id
   */
  setEditMode(): void {
    setTimeout(() => {
      this.textInput?.nativeElement.focus();
    }, 0);
    this.setEditingId.emit(this.todo.id);
  }

  /**
   * @description this method is used to remove from todo and make an api call
   */
  removeTodo(): void {
    this.todoService.removeTodo(this.todo.id);
  }

  /**
   * @description this method is used to toggle the status of the todo and make an api call
   */
  toggleTodo(): void {
    this.todoService.toggleTodo(this.todo.id);
  }
}

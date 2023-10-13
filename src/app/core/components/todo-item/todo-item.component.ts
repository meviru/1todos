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
  public todoService = inject(TodoService);

  @Input({ required: true }) todo!: Todo;
  @Input({ required: true }) isEditing!: boolean;

  @Output() setEditingId: EventEmitter<string | null> = new EventEmitter();

  @ViewChild('textInput') textInput?: ElementRef;
  public editingText: string = '';
  public isError: boolean = false;

  ngOnInit(): void {
    this.editingText = this.todo.text;
  }

  changeText(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.editingText = text;
  }

  onEdit(): void {
    if (this.editingText == "" || this.editingText.trim() == "") {
      this.isError = true;
    } else {
      this.setEditingId.emit(null);
      this.todoService.updateTodo(this.todo.id, this.editingText.trim()).subscribe((result) => {
        this.todoService.isTodoUpdated.next(true);
      });
      this.isError = false;
    }
  }

  setEditMode(): void {
    setTimeout(() => {
      this.textInput?.nativeElement.focus();
    }, 0);
    this.setEditingId.emit(this.todo.id);
  }

  removeTodo(): void {
    this.todoService.removeTodo(this.todo.id);
  }

  toggleTodo(): void {
    this.todoService.toggleTodo(this.todo.id).subscribe((result) => {
      this.todoService.isTodoUpdated.next(true);
    });
  }
}

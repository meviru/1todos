import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosComponent } from './components/todos/todos.component';

@NgModule({
  imports: [
    CommonModule,
    TodosComponent
  ],
  exports: [
    TodosComponent
  ],
  declarations: []
})
export class CoreModule { }

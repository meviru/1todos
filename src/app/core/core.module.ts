import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosComponent } from './components/todos/todos.component';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  imports: [
    CommonModule,
    TodosComponent,
    HttpClientModule
  ],
  exports: [
    TodosComponent
  ],
  declarations: []
})
export class CoreModule { }

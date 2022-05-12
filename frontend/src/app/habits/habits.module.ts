import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitsListComponent } from './habits-list/habits-list.component';



@NgModule({
  declarations: [
    HabitsListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HabitsListComponent
  ]
})
export class HabitsModule { }

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskService } from '../../services/task.service';
import Task from '../../models/task.model';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrl: './to-do.component.scss',
})
export class ToDoComponent {
  tasks$: Observable<Task[]>;
  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getAllTasks();
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe();
  }
}

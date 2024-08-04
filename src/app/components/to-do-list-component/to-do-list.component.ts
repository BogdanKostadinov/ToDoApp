import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Task from '../../models/task.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.scss',
})
export class ToDoListComponent implements OnInit {
  @Input() tasks: Task[] = [];
  @Output() deleteTaskEvent = new EventEmitter<number>();

  displayedColumns: string[] = ['select', 'name', 'description', 'delete'];
  dataSource = new MatTableDataSource<Task>([]);
  selection = new SelectionModel<Task>(true, []);

  ngOnInit(): void {
    this.dataSource.data = this.tasks;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  deleteTask(task: Task) {
    this.dataSource.data = this.dataSource.data.filter((d) => d.id !== task.id);
    this.deleteTaskEvent.emit(task.id);
  }
}

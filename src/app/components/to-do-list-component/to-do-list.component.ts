import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../models/item.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.scss',
})
export class ToDoListComponent implements OnInit {
  @Input() items!: Item[];

  displayedColumns: string[] = ['select', 'name', 'description', 'delete'];
  dataSource = new MatTableDataSource<Item>([]);
  selection = new SelectionModel<Item>(true, []);

  ngOnInit(): void {
    this.dataSource.data = this.items;
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

  deleteItem(item: Item) {
    this.dataSource.data = this.dataSource.data.filter((i) => i.id !== item.id);
  }
}

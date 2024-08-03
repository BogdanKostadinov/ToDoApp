import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Task from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private URL = 'http://localhost:3500';

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.URL}/tasks`);
  }
  deleteTask(id: number) {
    this.http.delete(`${this.URL}/task/${id}`).subscribe((x) => console.log(x));
  }
}

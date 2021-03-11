import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  url: string = '/api/v1/employees';
  constructor(private http: HttpClient) { }
  fetchAllEmployeeData() {
    return this.http.get(this.url);
  }

  createEmployee(empInfo) {
    return this.http.post('/api/v1/create', empInfo);
  }

  updateEmployee(id: any, empInfo) {
    return this.http.put('/api/v1/update/' + id, empInfo);
  }

  deleteEmployee(id: any[]) {
    return this.http.delete('/api/v1/delete/' + id);
  }
}

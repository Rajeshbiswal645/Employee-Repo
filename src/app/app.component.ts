import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeService } from './services/employee.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Employee';
  employeeData = [];
  employeeInfo: any;
  editMode: boolean = false;
  employeeId: any
  deletedEmployee: string = ''
  showDelItem: boolean = false


  @ViewChild('empInfoData') empInfoData: NgForm;

  constructor(private employeeService: EmployeeService) { }


  fetchEmployee() {
    this.employeeService.fetchAllEmployeeData().subscribe(res => {
      if (res['status'] == 'success') {
        let data = JSON.stringify(res);
        this.employeeData = JSON.parse(data).data;
        if (this.employeeData.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No employee record found. Do you want to add new employee ?',
          })
        }
      }
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error in fetching the record! please refresh',
      })
    })
  }

  createOrUpdateEmployee(empData: { name: string, salary: number, age: number }) {
    if (this.editMode) {
      this.employeeService.updateEmployee(this.employeeId, empData).subscribe(res => {
      }, err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error in updating the record',
        })
      });
    } else {
      this.employeeService.createEmployee(empData).subscribe(res => {
        this.employeeData.push({
          employee_name: res['data'].name,
          employee_salary: res['data'].salary,
          employee_age: res['data'].age,
          id: res['data'].id
        });
      }, err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error in creating the record',
        })
      });
    }
  }

  key: string = 'employee_name';
  reverse: boolean = false;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  editEmployee(index: number, id) {
    this.editMode = true;
    this.employeeId = id;
    this.empInfoData.setValue({
      name: this.employeeData[index].employee_name,
      salary: this.employeeData[index].employee_salary,
      age: this.employeeData[index].employee_age
    })
  }


  checkAllCheckBox(ev) {
    this.employeeData.forEach(x => x.checked = ev.target.checked)
  }

  isAllCheckBoxChecked() {
    return this.employeeData.every(p => p.checked);
  }

  deleteEmployee() {
    this.deletedEmployee = '';
    const selectedEmployees = this.employeeData.filter(emp => emp.checked).map(p => p.id);
    for (let employee = 0; employee < selectedEmployees.length; employee++) {
      this.employeeService.deleteEmployee(selectedEmployees[employee]).subscribe(res => {
        if (res['status'] == 'success') {
          this.showDelItem = true;
          this.deletedEmployee += selectedEmployees[employee] + ' deleted successfully';
          setInterval(() => {
            this.showDelItem = false;
          }, 3000);
        }
      }, err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error in deleteing the record',
        })
      });
    }
  }

  ngOnInit() {
    this.fetchEmployee();
  }

}

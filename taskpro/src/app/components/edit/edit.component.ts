import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { StudentsService } from '../../services/students.service';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatLabel, MatFormField, MatOption, MatInput, MatButton, MatSelect, CommonModule, DragDropModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {

  constructor(private studentservice: StudentsService, private snackbar: SnackbarService) { }

  student: any = {};
  studentClass: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  ngOnInit(): void {

    this.studentservice.studentEditData$.subscribe({
      next: (data: any) => {
        this.student = data;
        console.log(data);
      },
      error: (error: any) => {
        console.error(error)
      }
    })

  }

  resetForm() {

  }
  changeEvent(event: any) {
    console.log(event.target.value);
  }
  saveStudent(id: any) {
    console.log(id);
    console.log(this.student);
    delete this.student.age;
    this.studentservice.updateStudents(id, this.student).subscribe({
      next: (res: any) => {
        console.log(res.age + "Updated Successfully");
        this.snackbar.openSnackBar("Updated Successfully");
        if (res.age) {
          this.student.age = res.age;
          this.studentservice.studentEditComponent$.next(false);

        }

      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }
  deleteStudent(id:any){
    
  }
  cancelForm() {
    this.studentservice.studentEditComponent$.next(false);
  }

}

import { CommonModule, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { StudentsService } from '../../services/students.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatCardHeader } from '@angular/material/card';
import { ConnectionclientService } from '../../services/connectionclient.service';

@Component({
  selector: 'app-studentside',
  standalone: true,
  imports: [MatFormField, MatSelect, MatOption, MatButton, MatLabel, FormsModule, CommonModule, MatLabel, MatSelect, MatOption, MatInput, MatCardHeader],
  templateUrl: './studentside.component.html',
  styleUrl: './studentside.component.css'
})
export class StudentsideComponent implements OnInit {

  editingRecordId: string | null = null;
  isEditing = false;
  originalRecord: any = null;
  selectedRecord: any = null;

  confirmDelete(id: any) {

    this.studentserv.delStudents(id).subscribe({
      next: (res: any) => {
        console.log("res====>", res);
        this.snackbar.openSnackBar(res.studentname + " deleted");
        this.studentserv.cancelTrigger();

      },
      error: (err: any) => {
        console.log("err---------------->", err);



      }
    })


  }



  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = () => {
      this.base64String = fileReader.result as string;

      console.log(this.base64String)
      this.student.profilePhoto = this.base64String;

    };

    fileReader.readAsDataURL(file);


  }
  // @Input() student: any = {};
  // @Output() formSubmit = new EventEmitter<any>();
  base64String: any = "";

  constructor(private studentserv: StudentsService, private snackbar: SnackbarService,
    private clientfeathers: ConnectionclientService
  ) { }
  ngOnInit(): void {
    this.clientfeathers.authenticate();
    let serviceStude = this.clientfeathers.getStudentClient();
    let productStude = this.clientfeathers.getProductClient();

    // serviceStude.on("created", () => {
    //   this.initialAllData();

    // })
    serviceStude.on("patched", (updateStudents: any) => {
      this.handleRealtimeUpdate(updateStudents);
    })
    productStude.on("patched", (updatedProducts: any) => {
                  console.log("product patch started anoter dependent view")

      this.handleRealtimeUpdate(updatedProducts);
    })

    this.studentserv.studentEdit$.subscribe({
      next: (res: any) => {
        console.log(res);
        if (res) {
          this.student = { ...res };
          this.isEditing = true;
          this.originalRecord = { ...res };
          this.editingRecordId = res._id;


          this.selectedRecord = res;

        }
        else {
          this.student = {};
          this.originalRecord = {};

        }

      },
      error: (err: any) => {
        console.error(err);

      }
    })
    this.filterClasses();

  }
  cancelEdit() {
    this.isEditing = false;
    this.editingRecordId = null;

    this.editingRecordId = '';
  }
  handleRealtimeUpdate(updated: any) {
    const check = updated._id === this.editingRecordId;

    if (this.isEditing && check) {
      this.snackbar.openSnackBar("Already user editing this record so this process discarded");

    }
    this.cancelEdit();
    this.cancelForm();
    this.studentserv.cancelTrigger();

       this.student = this.student.map((items: any) => items._id === updated._id ? updated : items)

    
   


  }
  student: any = {};


  classList = ['LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  classAgeMap: any = {
    'LKG': { min: 3, max: 4 },
    'UKG': { min: 4, max: 5 },
    '1': { min: 5, max: 7 },
    '2': { min: 6, max: 8 },
    '3': { min: 7, max: 9 },
    '4': { min: 8, max: 10 },
    '5': { min: 9, max: 11 },
    '6': { min: 10, max: 12 },
    '7': { min: 11, max: 13 },
    '8': { min: 12, max: 14 },
    '9': { min: 13, max: 15 },
    '10': { min: 14, max: 16 },
    '11': { min: 15, max: 17 },
    '12': { min: 16, max: 18 }
  };

  filteredClasses: string[] = [];


  ngOnChanges() {
    if (this.student?.dob) {
      this.filterClasses();
    }
  }
  cancelForm() {
    this.studentserv.cancelTrigger();
  }

  calculateAge(dob: string): number {
    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  dobChange() {
    this.filterClasses();
  }

  filterClasses() {
    const age = this.calculateAge(this.student.dob);

    if (age >= 17) {
      this.filteredClasses = ['10', '11', '12'];
      return;
    }

    this.filteredClasses = this.classList.filter(cls => {
      const range = this.classAgeMap[cls];
      return age >= range.min && age <= range.max;
    });

    if (!this.filteredClasses.includes(this.student.class)) {
      this.student.class = null;
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;


    console.log(this.student);

    this.studentserv.addStudent(this.student).subscribe({
      next: (res: any) => {
        console.log(res);
        this.snackbar.openSnackBar(res.studentname + " added")
        this.cancelForm();

      },
      error: (err: any) => {
        console.error(err);
      }

    })


    form.resetForm();
  }
  onUpdate(id: any, form: NgForm) {

    if (form.invalid) return;
    delete this.student.age;
    this.studentserv.updateStudents(id, this.student).subscribe({
      next: (res: any) => {
        console.log(res);
        this.snackbar.openSnackBar(res.studentname + " updated");
        this.cancelForm();

      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

}

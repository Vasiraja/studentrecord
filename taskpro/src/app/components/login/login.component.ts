import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserserviceService } from '../../services/userservice.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../services/snackbar.service';
// import { MatButtonModule } from "@angular/material/button";
// import { MatInputModule } from "@angular/material/input"
// import { MatFormField } from "@angular/material/form-field"
// import { MatLabel } from "@angular/material/form-field"

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  loginState: boolean = true;

  actionform!: NgForm;
  loginForm!: NgForm;
  userdetails: any = {};
  constructor(private userServ: UserserviceService, private router: Router, private snackBar: SnackbarService, private cdr: ChangeDetectorRef) { }





  submitForm(form: NgForm) {
    console.log(form.value);
    this.userdetails = form.value;
    console.log(this.userdetails);
    const { email, password, name } = form.value;

    this.userServ.signupUser(email, password, name).subscribe({
      next: (res: any) => {
        console.log("Signup Successfully", res);
        this.snackBar.openSnackBar("signup successfully")
        // this.cdr.detectChanges();
        console.log(this.loginState);
        this.loginState = true;
      },
      error: (err: any) => {
        console.log(err);
        if (err.status === 400) {
          this.snackBar.openSnackBar("Email Already Exists")
        }



      }
    })


  }
  toggleState() {
    this.loginState = !this.loginState;
  }
  submitLogin(form: NgForm) {

    const { email, password } = form.value;
    console.log(form.value)
    console.log(password)
    this.userServ.loginUser(email, password).subscribe({
      next: (res: any) => {
        console.log(res);
        localStorage.setItem("token", res.accessToken);
        

        console.log("login successfully");
        this.snackBar.openSnackBar("login successfully")
        this.router.navigate(["/"]);
      },
      error: (err: any) => {
        console.error(err);
        if (err.status === 401) {

          this.snackBar.openSnackBar("wrong email or password")
        }
      }

    })
  }

}

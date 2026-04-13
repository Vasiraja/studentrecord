import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor() { }
  private snackBar = inject(MatSnackBar)


  openSnackBar(message: string, duration = 3000) {
    this.snackBar.open(message, 'close', {
      duration,
      horizontalPosition: "right",
      verticalPosition: "top",


    })
  }


  




}

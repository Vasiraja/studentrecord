import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { StudentsService } from '../../services/students.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-profilecard',
  standalone: true,
  imports: [
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
    // MatCardActions,
    // MatListItem,
    // MatList,
    MatDivider,
    CommonModule,
    // MatIcon
  ],
  templateUrl: './profilecard.component.html',
  styleUrl: './profilecard.component.css'
})
export class ProfilecardComponent implements OnInit {


  downloadPhoto(event: Event, profilePhotoSafe: any) {
    event.stopPropagation();
    console.log("download");
    console.log(profilePhotoSafe);

    const getPhoto = profilePhotoSafe;

    if (!getPhoto) return;



    const url = this.sanitizer.sanitize(SecurityContext.URL, getPhoto);

    if (!url) return;

    const link = document.createElement('a');
    link.href = url;

    link.download = "profile.png";
    link.click();




  }
  delPhoto(event: Event, id: any, type: any) {
    event.stopPropagation()
    this.studentservice.deleteProfilePhoto(id, type).subscribe({
      next: (res: any) => {
        console.log(res);
        this.snackbar.openSnackBar("Photo deleted");
        this.profileData.profilePhoto = null;
        this.profilePhotoSafe = null;


      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }
  base64String: string = '';
  @Input() profileData: any = {};
  profilePhotoSafe: SafeUrl | null = null;

  constructor(
    private sidebarservice: SidebarService,
    private studentservice: StudentsService,
    private sanitizer: DomSanitizer,
    private snackbar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.initializeProfile()
    console.log(this.profileData)

  }
  initializeProfile() {
    // this.sidebarservice.profileCardData$.subscribe({
    //   next: (res: any) => {
    //     // this.profileData = res;

    //     let photoStr = "";
    //     if (res.studentname || res.title) {
    //       photoStr = res.profilePhoto || "";
    //     }

    //     this.profilePhotoSafe = this.sanitizer.bypassSecurityTrustUrl(photoStr);
    //   },
    //   error: (err: any) => {
    //     console.error(err);
    //   }
    // });
  }
  onPhotoSelected(event: any, id: any, type: any) {
    console.log(type)
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = () => {
      this.base64String = fileReader.result as string;

      this.studentservice.updatePhoto(id, this.base64String, type).subscribe({
        next: (res: any) => {
          this.profileData.profilePhoto = this.base64String;
          this.profilePhotoSafe = this.sanitizer.bypassSecurityTrustUrl(this.base64String);

          this.snackbar.openSnackBar("Photo updated successfully");
          this.resetFileInput(event);
        },
        error: (err: any) => {
          console.error(err);
          this.resetFileInput(event);
        }
      });
    };

    fileReader.readAsDataURL(file);
  }
  resetFileInput(event: any) {
    if (event && event.target) {
      event.target.value = '';
    }
  }
}
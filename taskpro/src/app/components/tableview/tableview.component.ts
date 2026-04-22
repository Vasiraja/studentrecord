import { AfterViewInit, Component, Input, NgZone, OnInit } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatToolbar } from '@angular/material/toolbar';
import { ProductsService } from '../../services/products.service';
import { StudentsService } from '../../services/students.service';
import { forkJoin } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatCardHeader } from '@angular/material/card';
import { MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { ɵEmptyOutletComponent } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ConnectionclientService } from '../../services/connectionclient.service';
import { UserserviceService } from '../../services/userservice.service';


@Component({
  selector: 'app-tableview',
  standalone: true,
  imports: [MatTableModule, MatTable, MatToolbar, MatButton, CommonModule, MatCardHeader, MatFormField, MatLabel, FormsModule, MatFormFieldModule, MatFormField, MatInput, MatOption, MatSelect],
  templateUrl: './tableview.component.html',
  styleUrl: './tableview.component.css'
})
export class TableviewComponent implements OnInit {
  cancelEdit() {
    this.editedId = '';
    this.editedStudent = null;
    this.editedProduct = null;
  }


  saveStudent(student: any) {

    delete this.editedStudent.age;


    this.studentservice.updateStudents(student._id, this.editedStudent).subscribe({
      next: (res: any) => {
        this.snackbar.openSnackBar(res.studentname + " updated");
        console.log(res);

        this.cancelEdit();
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  saveProduct(product: any) {
    this.productservice.updateProducts(product._id, this.editedProduct).subscribe({
      next: (res: any) => {
        this.snackbar.openSnackBar("Product Updated");
        this.productservice.productEditStatus$.next(false);
        this.cancelEdit()
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  calculateAge(dob: string): number {
    if (!dob) return 0;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
  filterClassesByAge(age: number) {
    this.filteredClass = this.studentClass.filter((cls: string) => {
      const range = this.classAgeMap[cls];
      return age >= range.min && age <= range.max;
    });
  }
  onDobChange() {
    const age = this.calculateAge(this.editedStudent.dob);
    this.filterClassesByAge(age);
  }

  photoUrl!: SafeUrl;

  productsArrayBulk: any[] = [

  ];

  selectedView: any = '';

  productsApi: any[] = [];
  products: any[] = [];
  students: any[] = [];
  selectedFile: any;
  filteredClass: any[] = [];

  productCategories: any = ['Grocery', 'Gadgets', 'Electronics', 'Furniture'];


  classAgeMap: any = {
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
  studentClass: any[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']


  productApiColumns: string[] = ['id', 'title', 'rating', 'category', 'stock', 'price'];
  productDbColumns: string[] = ['photo', 'id', 'name', 'category', 'stock', 'overallrating', 'price', 'actions'];
  studentColumns: string[] = ['photo', 'id', 'name', 'dob', 'class', 'gender', 'age', 'actions'];

  sortingtoggle: boolean | undefined;
  @Input() tableData: any = {};
  editedStudent: any = {};
  editedProduct: any = {};
  editedId: string = "";



  constructor(
    private productservice: ProductsService,
    private studentservice: StudentsService,
    private sidebarservice: SidebarService,
    private snackbar: SnackbarService,
    private sanitizer: DomSanitizer,
    private clientfeathers: ConnectionclientService,
    private userservice: UserserviceService,
    private ngzone: NgZone
  ) { }
  async ngOnInit() {
    this.initialAllData();
    console.log("Table data");
    console.log(this.tableData);

    if (this.tableData?.type === 'products') {
      this.selectedView = 'products';
    }
    else if (this.tableData?.type === 'productdb') {
      this.selectedView = 'productdb';
    }
    else if (this.tableData?.type === 'students') {
      this.selectedView = 'students';
    }


    const studentsserv = this.clientfeathers.getStudentClient();
    this.clientfeathers.authenticate();

    studentsserv.on("created", () => {

      this.initialAllData();

    });
    studentsserv.on("patched", () => {
      console.log("patched started.................>")

    });



  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
    // event.target.value = null;
    console.log("event target value");
    event.target.value = null;
  }

  uploadFile() {
    if (!this.selectedFile) return;

    console.log("uploadd--------" + this.selectedFile);
    this.snackbar.openSnackBar("file uploaded");




    // Papa.parse(this.selectedFile,
    //   header: true,
    //   skipEmptyLines: true,
    //   dynamicTyping: true,
    //   complete: (results) => {
    //     this.parsedRows = results.data as any;
    //   })

    if (this.selectedFile.name.endsWith('.xlsx')) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const binaryStr = e.target.result;

        const workbook = XLSX.read(binaryStr, { type: 'binary' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        this.productsArrayBulk = XLSX.utils.sheet_to_json(sheet);

        console.log(this.productsArrayBulk);
      };

      reader.readAsBinaryString(this.selectedFile);

    }





    if (this.productsArrayBulk.length <= 0) return;
    console.log(this.productsArrayBulk);

    let bulk: boolean = true;

    this.productsArrayBulk = this.productsArrayBulk.map((item) =>
      ({ ...item, bulk: bulk })
    );


    this.productservice.bulkCreate(this.productsArrayBulk).subscribe({
      next: (res: any) => {
        console.log(res);
        this.snackbar.openSnackBar("bulk data imported")
        this.selectedFile = null;
      },
      error: (err: any) => {
        console.error(err)
      }
    })


    this.selectedFile = null;
  }

  cancelUpload() {
    this.selectedFile = null;
  }
  // ngAfterViewInit(): void {
  //   this.sidebarservice.profileCardTrigger$.next(false);
  //   this.initialAllData();

  // this.sidebarservice.selectedNode$.subscribe((data: any) => {
  //   if (data?.type === 'products') {
  //     this.selectedView = 'products';
  //   } else if (data?.type === 'productdb') {
  //     this.selectedView = 'productdb';
  //   } else if (data?.type === 'students') {
  //     this.selectedView = 'students';
  //   }
  // });
  // }

  formateImg(imgString: any): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imgString);
  }


  addProduct() {
    this.studentservice.addProductTrigger();
  }

  addStudent() {
    this.studentservice.addTrigger();
  }

  editStudent(student: any) {
    this.editedId = student._id;
    this.editedStudent = { ...student };

    const age = this.calculateAge(this.editedStudent.dob);
    this.filterClassesByAge(age);
  }

  editProducts(product: any) {
    this.editedId = product._id;
    this.editedProduct = { ...product };
  }

  deleteStudent(id: any) {
    this.studentservice.delStudents(id).subscribe({
      next: (res: any) => {
        console.log(res)
        this.snackbar.openSnackBar('user deleted');
        this.initialAllData();
      }
    });
  }

  deleteProducts(id: any) {
    this.productservice.deleteProducts(id).subscribe({
      next: (res: any) => {
        console.log(res)
        this.snackbar.openSnackBar('product deleted');
        this.initialAllData();
      }
    });
  }



  initialAllData() {
    const productfetch = this.productservice.getThirdpartyProducts();
    const productDbFetch = this.productservice.getProducts();
    const studentfetch = this.studentservice.getStudents();

    forkJoin({ productfetch, productDbFetch, studentfetch }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.productsApi = res.productfetch.products;
        this.products = res.productDbFetch.data;
        this.students = res.studentfetch.data;
        const currentUser = res.studentfetch.loggedUser;
        console.log("currentuser-->", currentUser)

        this.sidebarservice.currentLoggedIn(currentUser);



      }
    });
  }
}
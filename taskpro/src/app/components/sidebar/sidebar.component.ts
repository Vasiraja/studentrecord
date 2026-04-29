import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, NgZone, Input, ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { StudentsService } from '../../services/students.service';
import { ProductsService } from '../../services/products.service';
import { catchError, forkJoin, of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { TableviewComponent } from "../tableview/tableview.component";
import { ConnectionclientService } from '../../services/connectionclient.service';
import { SidebarchildComponent } from '../sidebarchild/sidebarchild.component';
import { SnackbarService } from '../../services/snackbar.service';

declare var $: any;


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, TableviewComponent, SidebarchildComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, AfterViewInit {
  finalTakenValues: any = {};


  constructor(private studentservice: StudentsService, private productservice: ProductsService, private sidebarservice: SidebarService,
    private feathersClient: ConnectionclientService,
    private ngzone: NgZone, private snackbar: SnackbarService, private cdr: ChangeDetectorRef

  ) { }

  expandState: boolean = false;
  @Output() selectItem = new EventEmitter<any>();
  @Output() selectTable = new EventEmitter<any>();

  apiErrorMsg: string = "";
  apiError: boolean = false;

  // @Input() selectedSharedItem: any = {};

  selectedSharedItem: any = {};
  editedStudent: any = {};
  editedProduct: any = {};
  toggleState() {
    this.expandState = !this.expandState;
  }
  ngAfterViewInit(): void {

    const productFetch = this.productservice.getThirdpartyProducts().pipe(
      catchError(err => {
        this.apiError = true;

        if (err.status === 0) {
          this.apiErrorMsg = 'External API not reachable';
        } else if (err.status >= 500) {
          this.apiErrorMsg = 'External API server error';
        } else {
          this.apiErrorMsg = 'Failed to load external products';
        }

        return of(null);
      })
    );

    const studentFetch = this.studentservice.getStudents();
    const productDbFetch = this.productservice.getProducts();

    forkJoin({
      products: productFetch,
      students: studentFetch,
      productsDB: productDbFetch
    }).subscribe({
      next: (res: any) => {

        this.apiProducts = res.products?.products || [];
        this.students = res.students?.data || [];
        this.dbProducts = res.productsDB?.data || [];

        this.treeState = true;
        if (this.treeState) {
          this.initializeTreeView();
        }

      },
      error: (err: any) => {
        console.error(err);
      }
    });

    const studentsserv = this.feathersClient.getStudentClient();

    studentsserv.on("created", (newstudent: any) => {
      this.ngzone.run(() => {

        const tree = $(this.treeElem.nativeElement).jstree(true);

        if (!tree.get_node(newstudent._id)) {
          tree.create_node("student_root", {
            id: newstudent._id,
            text: newstudent.studentname,
            icon: "fa-regular fa-id-badge",
            type: "studentsapi"
          });
        }

        this.students.push(newstudent);
        tree.open_node("student_root");

      });
    });
  }


  @ViewChild("treeElem") treeElem!: ElementRef;

  students: any[] = [];
  apiProducts: any[] = [];
  dbProducts: any[] = [];
  treeState: boolean = false;
  deletedStudent: any = {};
  deletedProduct: any = {};
  isCollapsed = false;

  // students = [
  //   {
  //     name: "rakesh", age: 12, class: "IV"
  //   },
  //   {

  //     name: "vishwanth", age: 12, class: "IV"
  //   },
  //   {

  //     name: "arkash", age: 12, class: "IV"
  //   },
  // ]

  async ngOnInit() {

    const studentsserv = this.feathersClient.getStudentClient();
    const productsserv = this.feathersClient.getProductClient();
    await this.feathersClient.authenticate();

    studentsserv.on("patched", (student: any) => {
      this.ngzone.run(() => {
        const tree = $(this.treeElem.nativeElement).jstree(true);

        if (tree && tree.get_node(student._id)) {
          tree.rename_node(student._id, student.studentname);
        }
      });
    });
    productsserv.on("patched", (product: any) => {
      console.log("PATCH EVENT PRODUCT:", product);
      if (!product.title) return;

      this.ngzone.run(() => {
        const tree = $(this.treeElem.nativeElement).jstree(true);

        if (tree && tree.get_node(product._id)) {
          // const updated = this.dbProducts.find(p => p._id === product._id);
          // console.log("updated",updated)
          console.log("product updated")
          console.log(product.title)

          const node = tree.get_node(product._id);
          console.log("BEFORE RENAME NODE TEXT:", node.text);
          console.log("NEW TITLE:", product.title);
        }
      })
    });


    studentsserv.on("removed", (student: any) => {
      this.ngzone.run(() => {
        const tree = $(this.treeElem.nativeElement).jstree(true);

        if (tree && tree.get_node(student._id)) {
          tree.delete_node(student._id);
        }
      });
    });
    productsserv.on("removed", (product: any) => {
      this.ngzone.run(() => {
        const tree = $(this.treeElem.nativeElement).jstree(true);

        if (tree && tree.get_node(product._id)) {
          tree.delete_node(product._id);
        }
      });
    })

    this.sidebarservice.sidebarState$.subscribe(state => {
      this.isCollapsed = state;
      console.log("Collapsed");
      console.log(this.isCollapsed)
    })

    this.sidebarservice.sidebarState$.subscribe(state => {
      this.isCollapsed = state;

      const tree = $(this.treeElem?.nativeElement).jstree(true);

      if (tree) {
        if (state) {
          tree.close_all();
          this.expandState=!state;
        }
      }
    });


  }
  finalTaken(msg: any) {
    console.log(msg);

    this.finalTakenValues = msg;
    console.log(this.finalTakenValues);
    this.cdr.detectChanges();
    const tree = $(this.treeElem.nativeElement).jstree(true);
    if (tree) {


      if (this.finalTakenValues.studentname) {

        tree.set_icon(this.finalTakenValues._id, 'fa-solid fa-check');
      }
      else if (this.finalTakenValues.rating) {
        tree.set_icon(this.finalTakenValues.id, 'fa-solid fa-check');


      }
      else if (this.finalTakenValues.overAllRating) {
        tree.set_icon(this.finalTakenValues._id, 'fa-solid fa-check');
      }
    }



  }


  initializeTreeView() {
    const treeView = this.treeElem.nativeElement;

    $(treeView).jstree({
      core: {
        check_callback: true,
        data: [
          {
            text: "Home",
            icon: "fa-solid fa-home",
            type: "home",

            children: [
              {
                id: "student_root",
                text: "students",

                icon: "fa-solid fa-user",
                type: "students",
                children: [
                  {
                    text: "Select the students",
                    icon: "fa-solid fa-circle-info",
                    type: "helper",
                    state: { disabled: true }
                  },
                  ...this.students.map(per => ({
                    text: per.studentname,
                    id: per._id,
                    icon: "fa-regular fa-id-badge",
                    type: "studentsapi"
                  }))
                ]
              },
              {
                text: "External products",
                icon: "fa-solid fa-globe",
                type: "products",
                children: [
                  {
                    id: "external_product_root",
                    text: "Select the products",
                    icon: "fa-solid fa-circle-info",
                    type: "helper",
                    state: { disabled: true }
                  },
                  ...this.apiProducts.map(items => ({
                    text: items.title.length > 15
                      ? items.title.slice(0, 15) + '...'
                      : items.title,
                    id: items.id,
                    icon: "fa-solid fa-cart-shopping",
                    type: "productsapi"
                  }))
                ]
              },

              {
                text: "Internal products",
                icon: "fa-solid fa-store",
                type: "productdb",

                children:
                  [
                    {
                      id: "internal_product_root",
                      text: "Select the products",
                      icon: "fa-solid fa-circle-info",
                      type: "helper",
                      state: { disabled: true }
                    },
                    ...this.dbProducts.map(items => ({
                      text: items.title,
                      id: items._id,
                      icon: items.bulk
                        ? "fa-solid fa-box"
                        : "fa-solid fa-cart-shopping",
                      type: "productsdbapi"
                    }))
                  ]

              }
            ]
          }
        ]
      },

      plugins: ["contextmenu"],

      contextmenu: {
        items: (node: any) => {
          console.log(node);
          if (node.original?.type === 'students' || node.original?.type === 'productdb') {
            return {
              create: {
                label: "Create",
                action: () => {
                  console.log(node);
                  console.log(node?.original.type)
                  if (node.original?.type === "students") {
                    this.studentservice.addTrigger();

                  }
                  else if (node.original?.type === "productdb") {
                    console.log("enter trigger")
                    this.studentservice.addProductTrigger();
                  }

                }
              }
            };
          }

          if (
            node.original?.type === 'studentsapi' ||
            node.original?.type === 'productsdbapi'
          ) {
            return {
              rename: {
                label: "Edit",
                action: () => {
                  console.log("edit:---");
                  console.log(node?.original?.id)
                  if (node.original?.type === 'studentsapi') {
                    this.editedStudent = this.students.find((items) => items._id === node?.original?.id);
                    this.studentservice.editTrigger(this.editedStudent);
                  }
                  else if (node.original?.type === 'productsdbapi') {
                    this.editedProduct = this.dbProducts.find((items) => items._id === node?.original?.id);
                    this.studentservice.editProductTrigger(this.editedProduct);
                    console.log("editeddd....")
                    console.log(this.editedProduct)
                  }

                }
              },
              remove: {
                label: "Delete",
                action: () => {
                  console.log(node);
                  if (node.original?.type === 'studentsapi') {
                    this.deletedStudent = this.students.find((items) => items._id === node.original?.id);
                    this.studentservice.deleteTrigger(this.deletedStudent);
                  }
                  else if (node.original?.type === 'productsdbapi') {
                    this.deletedProduct = this.dbProducts.find((items) => items._id === node.original?.id);
                    this.studentservice.deleteProductTrigger(this.deletedProduct)
                  }

                }
              }
            };
          }

          return {
            info: {
              label: "No actions available",
              _disabled: true
            }
          }
        }
      }
    });
    $(treeView).on('select_node.jstree', (e: any, value: any) => {

      this.studentservice.cancelTrigger();
      const node = value.node;

      if (node.original?.type === "students" || node.original?.type === "products" || node.original?.type === "productdb") {

        // this.sidebarservice.profileCardData$.next(false);
        this.sidebarservice.profileCardTrigger(false);

        // if (!checkDouble) {
        const sendTable = {
          id: node.id,
          text: node.text,
          type: node.original?.type
        }
        this.selectTable.emit(sendTable);
        console.log("entered...")
        // }



      }

      console.log(value.node);


      this.sidebarservice.individualNodeGet({
        id: node.id,
        type: node.original?.type

      }).subscribe({
        next: (res: any) => {
          console.log(res);
          console.log("res")
          this.selectedSharedItem = res;

          // console.log(this.selectedSharedItem)

          // this.selectedSharedItem.id = node.id;
          // this.selectedSharedItem.type = node;

          // console.log("this.selectedSharedItem" + this.selectedSharedItem.id, this.selectedSharedItem);


          this.selectItem.emit(res);
        },
        error: (err: any) => {
          console.log(err)
        }
      })

    })
    $(treeView)
      .on('create_node.jstree', (e: any, data: any) => {
        console.log("Created:", data.node);

      })
      .on('rename_node.jstree', (e: any, data: any) => {
        console.log("seeeee")
        console.log(data);
        console.log("Renamed:", data.text);



      })
      .on('delete_node.jstree', (e: any, data: any) => {
        console.log("Deleted:", data.node);

      });





  }
  collapseAll() {
    this.expandState = false;
    const tree = $(this.treeElem.nativeElement).jstree(true);
    if (tree) {
      tree.close_all();
    }
  }

  refreshtree() {
    const treeview = this.treeElem.nativeElement;

    if ($(treeview).jstree(true)) {
      $(treeview).jstree("destroy");
    }
    this.initializeTreeView();

  }
  expandAll() {
    this.expandState = true;
    const tree = $(this.treeElem.nativeElement).jstree(true);
    if (tree) {
      tree.open_all();
    }
  }




}
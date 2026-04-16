import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { StudentsService } from '../../services/students.service';
import { ProductsService } from '../../services/products.service';
import { forkJoin } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { TableviewComponent } from "../tableview/tableview.component";

declare var $: any;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, TableviewComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, AfterViewInit {

  constructor(private studentservice: StudentsService, private productservice: ProductsService, private sidebarservice: SidebarService) { }

  ngAfterViewInit(): void {
    // this.studentservice.getStudents().subscribe({
    //   next: (res: any) => {
    //     console.log(res);
    //     this.students = res.data;
    //     // console.log(this.students.map((items)=>items.studentname))

    //     this.productservice.getThirdpartyProducts().subscribe({
    //       next: (res: any) => {

    //         this.apiProducts = res.products;
    //         console.log(this.apiProducts);
    //         this.treeState = true;

    //         if (this.treeState) {
    //           this.initializeTreeView();
    //         }

    //       }
    //     }) 
    //   },
    //   error: (err: any) => {
    //     console.error(err);
    //   }
    // })
    const productFetch = this.productservice.getThirdpartyProducts();
    const studentFetch = this.studentservice.getStudents();
    const productDbFetch = this.productservice.getProducts();

    forkJoin({ products: productFetch, students: studentFetch, productsDB: productDbFetch }).subscribe({
      next: (res: any) => {
        this.apiProducts = res.products.products;
        this.students = res.students.data;
        this.dbProducts = res.productsDB.data;
        this.treeState = true;
        if (this.treeState) {
          this.initializeTreeView();
        }

      }, error: (err: any) => {
        console.error(err)
      }
    })

  }


  @ViewChild("treeElem") treeElem!: ElementRef;

  students: any[] = [];
  apiProducts: any[] = [];
  dbProducts: any[] = [];
  treeState: boolean = false;

  ngOnInit(): void {


  }

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
  initializeTreeView() {
    const treeView = this.treeElem.nativeElement;

    $(treeView).jstree({
      core: {
        data: [
          {
            text: "Home", icon: "fa-solid fa-home",
            children: [{
              text: "students", icon: "fa-solid fa-user", type: "students",
              children: this.students.map(per => ({
                text: per.studentname,
                id: per._id,
                icon: "fa-regular fa-id-badge", type: "studentsapi"



              }

              ))

            }, {
              text: "products", icon: "fa-solid fa-store", type: "products",
              children: this.apiProducts.map((items) => (
                { text: items.title.length > 15 ? items.title.slice(0, 15) + '...' : items.title, id: items.id, icon: "fa-solid fa-cart-shopping", type: "productsapi" }
              ))
            },
            {
              text: "productsDB", icon: "fa-solid fa-store", type: "productdb",
              children: this.dbProducts.map((items) => ({
                text: items.title, id: items._id, icon: items.bulk
                  ? "fa-solid fa-box"
                  : "fa-solid fa-cart-shopping", type: "productsdbapi"
              }))
            },

            ]
          }

        ]
      },


    })

    $(treeView).on('select_node.jstree', (e: any, value: any) => {



      const node = value.node;

      if (node.original?.type === "students" || node.original?.type === "products" || node.original?.type === "productdb") {

        // this.sidebarservice.profileCardData$.next(false);
        this.sidebarservice.profileCardTrigger(false);

        // if (!checkDouble) {
        this.sidebarservice.sendNode({
          id: node.id,
          text: node.text,
          type: node.original?.type
        })
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
          this.sidebarservice.profileDataObserve(res);
          this.sidebarservice.profileCardTrigger(true);
        },
        error: (err: any) => {
          console.log(err)
        }
      })

    })


    $("#expandAll").on('click', function () {

      $('#treeElem').jstree('open_all')
    })
    $("#collapseAll").on('click', function () {

      $('#treeElem').jstree('close_all')
    })

  }




}
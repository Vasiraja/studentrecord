import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filterapiscategories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filterapiscategories.component.html',
  styleUrl: './filterapiscategories.component.css'
})
export class FilterapiscategoriesComponent implements OnInit {


  @Input() apicategories: string[] = [];
  @Output() passCategory = new EventEmitter<any>();
 

  ngOnInit(): void {

    console.log(this.apicategories);

  }
  changeCategories(event: any) {
    const value = event.target.value;

    this.passCategory.emit({
      category: value
    }
    );




  }
}

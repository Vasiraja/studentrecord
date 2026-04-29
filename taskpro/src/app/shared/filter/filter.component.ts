import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit {
  @Input() categories: string[] = [];

  @Output() filterChange = new EventEmitter<any>();

 

  selectedCategory = '';
  ngOnInit(): void {
    console.log("classes");
 
  }
  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    this.filterChange.emit({
      category: this.selectedCategory
    })
  }



}

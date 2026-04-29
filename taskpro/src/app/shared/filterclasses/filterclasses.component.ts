import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-filterclasses',
  standalone: true,
  imports: [MatSelectModule, CommonModule, MatOptionModule],
  templateUrl: './filterclasses.component.html',
  styleUrl: './filterclasses.component.css'
})
export class FilterclassesComponent implements OnInit {

  @Input() classTypes: any;
  @Output() triggerClasses = new EventEmitter<any>();



  ngOnInit(): void {
    console.log(this.classTypes);

  }
  changeTrigger(event: any) {
    const value = event.target.value;
    this.triggerClasses.emit({
      class: value
    });
  }

}

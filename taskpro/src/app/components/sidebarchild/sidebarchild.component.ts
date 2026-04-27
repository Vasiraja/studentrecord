import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebarchild',
  standalone: true,
  imports: [],
  templateUrl: './sidebarchild.component.html',
  styleUrl: './sidebarchild.component.css'
})
export class SidebarchildComponent {
  clickConfirm() {
    this.selectedConfirmation.emit(this.selectedInput)
  }


  @Input() selectedInput: any;
  @Output() selectedConfirmation: any = new EventEmitter<any>;
}

import { Component } from '@angular/core';
import { MatCardModule, MatCard, MatCardContent, MatCardFooter, MatCardHeader } from '@angular/material/card'
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCard, MatCardContent, MatCardFooter, MatCardHeader],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

}

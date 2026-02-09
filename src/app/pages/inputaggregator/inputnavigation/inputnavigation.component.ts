import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-inputnavigation',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './inputnavigation.component.html',
  styleUrl: './inputnavigation.component.css'
})
export class InputnavigationComponent {

}

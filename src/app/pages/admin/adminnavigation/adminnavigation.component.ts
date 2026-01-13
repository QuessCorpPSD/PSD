import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-adminnavigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './adminnavigation.component.html',
  styleUrl: './adminnavigation.component.css'
})
export class AdminnavigationComponent {

}

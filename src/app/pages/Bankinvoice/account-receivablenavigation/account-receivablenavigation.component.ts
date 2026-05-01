import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-receivablenavigation',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './account-receivablenavigation.component.html',
  styleUrl: './account-receivablenavigation.component.css'
})
export class AccountReceivablenavigationComponent {

}

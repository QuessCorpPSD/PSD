import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';

@Component({
  selector: 'app-qrsmaster',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    CompanyallComponent
],
  templateUrl: './qrsmaster.component.html',
  styleUrl: './qrsmaster.component.css'
})
export class QRSmasterComponent {

  selectedCompanyId: any = null;
  statusSearch: string = '';

  statusList = [
    { id: 'Active', name: 'Active' },
    { id: 'Inactive', name: 'Inactive' }
  ];

  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
  }

  onSearch() {
  }

  exportToExcel() {
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
    }
  }

  importData() {
  }
}
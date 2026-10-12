import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';

@Component({
  selector: 'app-vmscharge',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    CompanyallComponent
],
  templateUrl: './vmscharge.component.html',
  styleUrl: './vmscharge.component.css'
})
export class VMSchargeComponent {

  selectedCompanyId: any = null;
  showTable: boolean = true;
  selectedRow: any = null;

  uploadDisplayedColumns: string[] = [
    'SNo',
    'CompanyCode',
    'GroupName',
    'VmsType',
    'VmsCharges',
    'EffectiveDate',
    'ProRate'
  ];

  dataSource = {
    data: []
  };

  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
  }

  onSearch() {
    this.showTable = true;
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

  downloadTemplate() {
  }

  onRowSelect(row: any) {
    this.selectedRow = row;
  }
}
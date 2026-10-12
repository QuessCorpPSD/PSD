import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-entitybilling',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './entitybilling.component.html',
  styleUrl: './entitybilling.component.css',
})
export class EntitybillingComponent {

  uploadDisplayedColumns: string[] = ['Action', 'SNo', 'CompanyGroupName', 'PayPeriod', 'HeadCount'];
  dataSource = new MatTableDataSource<any>([]);
  showTable = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  companyGroupList: any[] = [];
  payPeriodList: any[] = [];
  selectedCompanyGroupId: number | null = null;
  selectedPayPeriodId: number | null = null;

  selectedFile: File | null = null;

  showBillingPopup = false;
  isEditMode = false;
  showErrors = false;
  billingForm: FormGroup;
  rowData: any;

  constructor(private fb: FormBuilder) {
    this.billingForm = this.fb.group({
      companyGroupId: [null, Validators.required],
      payPeriodId: [null, Validators.required],
      headCount: ['', Validators.required],
    });
  }

  onsearch(): void {
    this.showTable = true;
  }

  openadd(): void {
    this.isEditMode = false;
    this.rowData = null;
    this.showErrors = false;
    this.billingForm.reset();
    this.showBillingPopup = true;
  }

  editBilling(row: any): void {
    this.isEditMode = true;
    this.rowData = row;
    this.showErrors = false;
    this.showBillingPopup = true;
    this.billingForm.patchValue({
      companyGroupId: row.companyGroupId,
      payPeriodId: row.payPeriodId,
      headCount: row.HeadCount,
    });
  }

  deleteBilling(row: any): void {
    if (!confirm('Are you sure you want to delete this record?')) return;
  }

  closePopup(): void {
    this.showBillingPopup = false;
    this.showErrors = false;
  }

  saveBilling(): void {
    this.showErrors = true;
    if (this.billingForm.invalid) {
      this.billingForm.markAllAsTouched();
      return;
    }
    this.closePopup();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) {
      this.selectedFile = null;
      return;
    }
    const name = file.name.toLowerCase();
    if (!(name.endsWith('.xlsx') || name.endsWith('.xls'))) {
      alert('Please upload a valid Excel file (.xlsx or .xls)');
      input.value = '';
      this.selectedFile = null;
      return;
    }
    this.selectedFile = file;
  }

  onImport(): void {
    if (!this.selectedFile) {
      alert('Please choose a file to import.');
      return;
    }
  }

  downloadTemplate(): void {
    const templateData = [
      { 'Company Group Code': '', 'Pay Period': '', 'Head Count': '' },
    ];
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(templateData);
    const wb: XLSX.WorkBook = {
      Sheets: { EntityBilling: ws },
      SheetNames: ['EntityBilling'],
    };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `EntityBilling_Template.xlsx`);
  }

  exportToExcel(): void {
    const data = this.dataSource.data.map((r: any, i: number) => ({
      SNo: i + 1,
      'Company Group Name': r.CompanyGroupName,
      'Pay Period': r.PayPeriod,
      'Head Count': r.HeadCount,
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = {
      Sheets: { EntityBilling: ws },
      SheetNames: ['EntityBilling'],
    };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `EntityBilling_${Date.now()}.xlsx`);
  }
}
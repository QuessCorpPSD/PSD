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
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';

@Component({
  selector: 'app-clientofficeaddress',
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
    CompanyallComponent,
  ],
  templateUrl: './clientofficeaddress.component.html',
  styleUrl: './clientofficeaddress.component.css',
})
export class ClientofficeaddressComponent {

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'CompanyCode',
    'CustomerName',
    'AddressCode',
    'CustomerLocationAddress',
    'LocalAuthority',
  ];
  dataSource = new MatTableDataSource<any>([]);
  showTable = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  customerNameSearch = '';
  selectedRow: any = null;

  localAuthorityList: any[] = [];

  showAddressPopup = false;
  isEditMode = false;
  showErrors = false;
  addressForm: FormGroup;
  rowData: any;

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      companyId: [null, Validators.required],
      addressCode: [''],
      customerLocationAddress: ['', Validators.required],
      localAuthority: [null, Validators.required],
    });
  }

  onsearch(): void {
    this.showTable = true;
  }

  handleCompany(event: any): void {
    if (!event) return;
    this.addressForm.patchValue({
      companyId: event.companyId,
    });
  }

  openadd(): void {
    this.isEditMode = false;
    this.rowData = null;
    this.showErrors = false;
    this.addressForm.reset();
    this.showAddressPopup = true;
  }

  editAddress(row: any): void {
    this.isEditMode = true;
    this.rowData = row;
    this.showErrors = false;
    this.showAddressPopup = true;
    this.addressForm.patchValue({
      companyId: row.companyId,
      addressCode: row.AddressCode,
      customerLocationAddress: row.CustomerLocationAddress,
      localAuthority: row.localAuthorityId,
    });
  }

  deleteAddress(row: any): void {
    if (!confirm('Are you sure you want to delete this record?')) return;
  }

  onRowSelect(row: any): void {
    this.selectedRow = row;
  }

  closePopup(): void {
    this.showAddressPopup = false;
    this.showErrors = false;
  }

  saveAddress(): void {
    this.showErrors = true;
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.closePopup();
  }

  exportToExcel(): void {
    const data = this.dataSource.data.map((r: any, i: number) => ({
      SNo: i + 1,
      'Company Code': r.CompanyCode,
      'Customer Name': r.CustomerName,
      'Address Code': r.AddressCode,
      'Customer Location Address': r.CustomerLocationAddress,
      'Local Authority': r.LocalAuthority,
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = {
      Sheets: { ClientOfficeAddress: ws },
      SheetNames: ['ClientOfficeAddress'],
    };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `ClientOfficeAddress_${Date.now()}.xlsx`);
  }
}
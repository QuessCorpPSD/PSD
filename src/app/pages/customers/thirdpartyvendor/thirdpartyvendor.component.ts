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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';

@Component({
  selector: 'app-thirdpartyvendor',
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
    MatTooltipModule,
    CompanyallComponent,
  ],
  templateUrl: './thirdpartyvendor.component.html',
  styleUrl: './thirdpartyvendor.component.css',
})
export class ThirdpartyvendorComponent {

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'Vendor_Name',
    'POC_Name_1',
    'POC_Mobile_NO_1',
    'POC_Email_Id_1',
    'POC_Name_2',
    'POC_Mobile_NO_2',
    'POC_Email_Id_2',
    'POC_Name_3',
    'POC_Mobile_NO_3',
    'POC_Email_Id_3',
    'Payment_Terms',
    'Agreement_Start',
    'Agreement_End',
  ];
  dataSource = new MatTableDataSource<any>([]);
  showTable = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  vendorSearch = '';
  selectedRow: any = null;

  showVendorPopup = false;
  isEditMode = false;
  showErrors = false;
  vendorForm: FormGroup;
  rowData: any;

  innerColumns: string[] = ['SNo', 'CompanyCode'];
  innerDataSource = new MatTableDataSource<any>([]);
  selectedInnerRow: any = null;

  @ViewChild('innerPaginator') innerPaginator!: MatPaginator;

  constructor(private fb: FormBuilder) {
    this.vendorForm = this.fb.group({
      vendorName: [''],
      agreementStart: ['', Validators.required],
      agreementEnd: ['', Validators.required],
      pocName1: ['', Validators.required],
      pocMobileNo1: ['', Validators.required],
      pocEmailId1: ['', Validators.required],
      pocName2: [''],
      pocMobileNo2: [''],
      pocEmailId2: [''],
      pocName3: [''],
      pocMobileNo3: [''],
      pocEmailId3: [''],
      paymentTerms: ['', Validators.required],
      clientDetails: ['', Validators.required],
    });
  }

  onsearch(): void {
    this.showTable = true;
  }

  openadd(): void {
    this.isEditMode = false;
    this.rowData = null;
    this.showErrors = false;
    this.selectedInnerRow = null;
    this.vendorForm.reset();
    this.innerDataSource = new MatTableDataSource<any>([]);
    this.showVendorPopup = true;
  }

  editVendor(row: any): void {
    this.isEditMode = true;
    this.rowData = row;
    this.showErrors = false;
    this.selectedInnerRow = null;
    this.showVendorPopup = true;
    this.vendorForm.patchValue({
      vendorName: row.Vendor_Name,
      agreementStart: row.Agreement_Start,
      agreementEnd: row.Agreement_End,
      pocName1: row.POC_Name_1,
      pocMobileNo1: row.POC_Mobile_NO_1,
      pocEmailId1: row.POC_Email_Id_1,
      pocName2: row.POC_Name_2,
      pocMobileNo2: row.POC_Mobile_NO_2,
      pocEmailId2: row.POC_Email_Id_2,
      pocName3: row.POC_Name_3,
      pocMobileNo3: row.POC_Mobile_NO_3,
      pocEmailId3: row.POC_Email_Id_3,
      paymentTerms: row.Payment_Terms,
      clientDetails: row.Client_Details,
    });
    this.innerDataSource = new MatTableDataSource<any>(row.companies || []);
  }

  deleteVendor(row: any): void {
    if (!confirm('Are you sure you want to delete this record?')) return;
  }

  onRowSelect(row: any): void {
    this.selectedRow = row;
  }

  onInnerRowSelect(row: any): void {
    this.selectedInnerRow = row;
  }

  closePopup(): void {
    this.showVendorPopup = false;
    this.showErrors = false;
    this.selectedInnerRow = null;
    this.innerDataSource = new MatTableDataSource<any>([]);
  }

  saveVendor(): void {
    this.showErrors = true;
    if (this.vendorForm.invalid) {
      this.vendorForm.markAllAsTouched();
      return;
    }
    this.closePopup();
  }

  addInnerRow(): void {
    const data = [...this.innerDataSource.data];
    data.push({ companyId: null, companyCode: '' });
    this.innerDataSource.data = data;
  }

  deleteInnerRow(row: any): void {
    if (!row) {
      alert('Please select a row to delete.');
      return;
    }
    const data = [...this.innerDataSource.data];
    const index = data.indexOf(row);
    if (index > -1) {
      data.splice(index, 1);
      this.innerDataSource.data = data;
      this.selectedInnerRow = null;
    }
  }

  handleCompany(event: any, row: any): void {
    if (!event) return;
    row.companyId = event.companyId;
    row.companyCode = event.companyCode;
  }

  exportToExcel(): void {
    const data = this.dataSource.data.map((r: any, i: number) => ({
      SNo: i + 1,
      Vendor_Name: r.Vendor_Name,
      POC_Name_1: r.POC_Name_1,
      POC_Mobile_NO_1: r.POC_Mobile_NO_1,
      POC_Email_Id_1: r.POC_Email_Id_1,
      POC_Name_2: r.POC_Name_2,
      POC_Mobile_NO_2: r.POC_Mobile_NO_2,
      POC_Email_Id_2: r.POC_Email_Id_2,
      POC_Name_3: r.POC_Name_3,
      POC_Mobile_NO_3: r.POC_Mobile_NO_3,
      POC_Email_Id_3: r.POC_Email_Id_3,
      Payment_Terms: r.Payment_Terms,
      Agreement_Start: r.Agreement_Start,
      Agreement_End: r.Agreement_End,
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = {
      Sheets: { ThirdPartyVendor: ws },
      SheetNames: ['ThirdPartyVendor'],
    };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `ThirdPartyVendor_${Date.now()}.xlsx`);
  }
}